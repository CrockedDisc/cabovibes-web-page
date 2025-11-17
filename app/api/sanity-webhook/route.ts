// app/api/sanity-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db, boats, partners, boatPlanPrices, boatsMedia } from '@/db'
import { eq, sql } from 'drizzle-orm'
import crypto from 'crypto'

function isValidSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('sanity-webhook-signature')
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET

    // ⭐ COMENTADO TEMPORALMENTE PARA DEBUG
    // if (process.env.NODE_ENV === 'production') {
    //   if (!signature || !webhookSecret || !isValidSignature(rawBody, signature, webhookSecret)) {
    //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    //   }
    // }
    
    // ⭐ OBTENER EL TIPO DE EVENTO DEL HEADER
    const eventType = request.headers.get('x-sanity-event-type') // 'create', 'update', 'delete'

    console.log('🔐 Signature check:')
    console.log('   Has signature:', !!signature)
    console.log('   Has secret:', !!webhookSecret)
    console.log('📨 Event Type:', eventType)

    const payload = JSON.parse(rawBody)
    const { _type } = payload

    console.log('📥 Webhook recibido:', {
      _type,
      operation: eventType,
      _id: payload._id,
      name: payload.name,
    })

    // ⭐ USAR EL EVENT TYPE DEL HEADER
    payload.operation = eventType || 'update'

    switch (_type) {
      case 'boat':
        await syncBoat(payload)
        break
      case 'partner':
        await syncPartner(payload)
        break
      case 'boat_plan_price':
        await syncBoatPlanPrice(payload)
        break
      default:
        console.log('⚠️ Tipo de documento no soportado:', _type)
    }

    return NextResponse.json({ success: true, message: 'Sync completed' })
  } catch (error) {
    console.error('❌ Error en webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Sincronizar Boat - VERSIÓN UPSERT
async function syncBoat(payload: any) {
  const { operation } = payload

  if (operation === 'delete') {
    if (!payload.id) return
    await db.delete(boatsMedia).where(eq(boatsMedia.boatId, payload.id))
    await db.delete(boats).where(eq(boats.id, payload.id))
    console.log('🗑️ Boat eliminado:', payload.id)
    return
  }

  // Obtener el partnerId
  let partnerId = null

  if (payload.partner?.id) {
    partnerId = payload.partner.id
  } else if (payload.partner?.name) {
    const existingPartner = await db.query.partners.findFirst({
      where: eq(partners.name, payload.partner.name)
    })
    
    if (existingPartner) {
      partnerId = existingPartner.id
      console.log('🔍 Partner encontrado por nombre:', existingPartner.id)
    } else {
      console.error('❌ Partner no encontrado:', payload.partner.name)
      throw new Error(`Partner "${payload.partner.name}" no existe en Supabase. Créalo primero.`)
    }
  } else if (payload.partnerId) {
    partnerId = payload.partnerId
  }

  if (!partnerId) {
    console.error('❌ Error: No se encontró partnerId')
    throw new Error('partnerId es requerido para crear/actualizar un boat')
  }

  const boatData = {
    name: payload.name || '',
    partnerId: partnerId,
    size: payload.size ? String(payload.size) : '0',
    capacity: payload.capacity || 0,
    features: payload.features || null,
    isPopular: payload.isPopular || false,
    type: payload.type || 'Luxury Yacht',
    isActive: payload.isActive ?? true,
  }

  // ⭐ UPSERT: Actualiza si existe (por nombre), inserta si no
  try {
    await db.execute(
      sql`
        INSERT INTO "Boats" (name, partner_id, size, capacity, features, is_popular, type, is_active)
        VALUES (${boatData.name}, ${boatData.partnerId}, ${boatData.size}, ${boatData.capacity}, ${boatData.features}, ${boatData.isPopular}, ${boatData.type}, ${boatData.isActive})
        ON CONFLICT (name) 
        DO UPDATE SET
          partner_id = EXCLUDED.partner_id,
          size = EXCLUDED.size,
          capacity = EXCLUDED.capacity,
          features = EXCLUDED.features,
          is_popular = EXCLUDED.is_popular,
          type = EXCLUDED.type,
          is_active = EXCLUDED.is_active
      `
    )
    
    console.log('✅ Boat sincronizado (upsert):', boatData.name)

    // Obtener el ID del boat (para sincronizar media)
    const syncedBoat = await db.query.boats.findFirst({
      where: eq(boats.name, boatData.name)
    })

    if (!syncedBoat) {
      console.error('❌ No se pudo obtener el boat después de upsert')
      return
    }

    const boatId = syncedBoat.id

    // Sincronizar media
    if (payload.media && Array.isArray(payload.media) && payload.media.length > 0) {
      try {
        await db.delete(boatsMedia).where(eq(boatsMedia.boatId, boatId))
        console.log('🗑️ Media anterior eliminado')

        const mediaData = payload.media
          .filter((item: any) => item.mediaUrl)
          .map((item: any) => ({
            boatId: boatId,
            mediaUrl: item.mediaUrl,
            mediaType: item.mediaType === 'video' ? ('video' as const) : ('image' as const),
            isFeatured: item.isFeatured || false,
          }))

        if (mediaData.length > 0) {
          await db.insert(boatsMedia).values(mediaData)
          console.log('🖼️ Media sincronizado:', mediaData.length, 'items')
        }
      } catch (error: any) {
        console.error('⚠️ Error sincronizando media (no crítico):', error.message)
      }
    } else {
      console.log('📭 Sin media para sincronizar')
    }
  } catch (error: any) {
    console.error('❌ Error en upsert de boat:', error.message)
    throw error
  }
}

// Sincronizar Partner - VERSIÓN UPSERT
async function syncPartner(payload: any) {
  const { operation } = payload

  if (operation === 'delete') {
    if (!payload.id) return
    await db.delete(partners).where(eq(partners.id, payload.id))
    console.log('🗑️ Partner eliminado:', payload.id)
    return
  }

  const partnerData = {
    name: payload.name || '',
    email: payload.email || null,
    phoneNumber: payload.phoneNumber || null,
  }

  // ⭐ UPSERT: Actualiza si existe (por nombre), inserta si no
  try {
    await db.execute(
      sql`
        INSERT INTO "Partners" (name, email, phone_number)
        VALUES (${partnerData.name}, ${partnerData.email}, ${partnerData.phoneNumber})
        ON CONFLICT (name) 
        DO UPDATE SET
          email = EXCLUDED.email,
          phone_number = EXCLUDED.phone_number
      `
    )
    
    console.log('✅ Partner sincronizado (upsert):', partnerData.name)
  } catch (error: any) {
    console.error('❌ Error en upsert de partner:', error.message)
    throw error
  }
}

// Sincronizar Boat Plan Price - CON MANEJO DE HUÉRFANOS
async function syncBoatPlanPrice(payload: any) {
  const { operation } = payload

  if (operation === 'delete') {
    if (!payload.id) return
    await db.delete(boatPlanPrices).where(eq(boatPlanPrices.id, payload.id))
    console.log('🗑️ Boat Plan Price eliminado:', payload.id)
    return
  }

  // Resolver el boatId
  let boatId = null
  if (payload.boat?.id) {
    boatId = payload.boat.id
  } else if (payload.boat?.name) {
    const existingBoat = await db.query.boats.findFirst({
      where: eq(boats.name, payload.boat.name)
    })
    if (existingBoat) {
      boatId = existingBoat.id
      console.log('🔍 Boat encontrado por nombre:', existingBoat.id)
    }
  } else if (payload.boatId) {
    boatId = payload.boatId
  }

  // ⭐ CAMBIO: No lanzar error, solo retornar
  if (!boatId) {
    console.warn('⚠️ Documento huérfano detectado (sin boat):', payload._id)
    console.warn('   Este documento será ignorado. Elimínalo desde Sanity Studio.')
    return // ← Retornar sin hacer nada
  }

  // Resolver el planId
  let planId = null
  if (payload.plan?.id) {
    planId = payload.plan.id
    console.log('🔍 Plan ID desde referencia:', planId)
  } else if (payload.planId) {
    planId = payload.planId
  }

  const priceData = {
    boatId: boatId,
    planId: planId,
    basePrice: payload.basePrice ? String(payload.basePrice) : '0',
    freePax: payload.freePax || 0,
    pricePerPerson: payload.pricePerPerson ? String(payload.pricePerPerson) : null,
    duration: payload.duration || '04:00:00',
  }

  // UPSERT
  try {
    await db.execute(
      sql`
        INSERT INTO "Boat_Plan_Prices" (boat_id, plan_id, base_price, free_pax, price_per_person, duration)
        VALUES (${priceData.boatId}, ${priceData.planId}, ${priceData.basePrice}, ${priceData.freePax}, ${priceData.pricePerPerson}, ${priceData.duration})
        ON CONFLICT (boat_id, plan_id) 
        DO UPDATE SET
          base_price = EXCLUDED.base_price,
          free_pax = EXCLUDED.free_pax,
          price_per_person = EXCLUDED.price_per_person,
          duration = EXCLUDED.duration
      `
    )
    
    console.log('✅ Boat Plan Price sincronizado (upsert)')
  } catch (error: any) {
    console.error('❌ Error en upsert de boat plan price:', error.message)
    throw error
  }
}



