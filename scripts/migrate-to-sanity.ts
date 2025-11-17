// scripts/migrate-to-sanity.ts
import { config } from 'dotenv'
import path from 'path'

// ⭐ PRIMERO: Cargar .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

// Validar DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definido en .env.local')
}

console.log('🔗 Conectando a base de datos...')
const dbUrl = process.env.DATABASE_URL
const dbHost = dbUrl.match(/@(.+?):/)?.[1] || 'unknown'
console.log('   URL:', process.env.DATABASE_URL.substring(0, 50) + '...')
console.log('   Host:', dbHost)
console.log('')

// ⭐ Crear conexión NUEVA de Drizzle (no importar la existente)
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { boats, partners, boatPlanPrices, boatsMedia } from '@/db'
import { eq } from 'drizzle-orm'

// Crear cliente de postgres con la URL del .env.local
const client = postgres(process.env.DATABASE_URL)
const db = drizzle(client)

import { createClient } from '@sanity/client'

// Validar variables de Sanity
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID no está definido en .env.local')
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('NEXT_PUBLIC_SANITY_DATASET no está definido en .env.local')
}

if (!process.env.SANITY_API_TOKEN) {
  throw new Error('SANITY_API_TOKEN no está definido en .env.local')
}

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

console.log('🔧 Configuración de Sanity:')
console.log('   Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('   Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
console.log('   Token:', process.env.SANITY_API_TOKEN ? '✅ Configurado' : '❌ Faltante')
console.log('')

async function migrateToSanity() {
  console.log('🚀 Iniciando migración...')

  try {
    // 1. Migrar Partners
    console.log('📦 Consultando partners...')
    const allPartners = await db.select().from(partners)
    console.log(`📦 Encontrados ${allPartners.length} partners`)

    for (const partner of allPartners) {
      const sanityDoc = {
        _type: 'partner',
        _id: `partner-${partner.id}`,
        id: partner.id,
        name: partner.name,
        email: partner.email,
        phoneNumber: partner.phoneNumber,
      }

      await sanityClient.createOrReplace(sanityDoc)
      console.log(`✅ Partner migrado: ${partner.name} (ID: ${partner.id})`)
    }

    // 2. Migrar Boats
    console.log('\n📦 Consultando boats...')
    const allBoats = await db.select().from(boats)
    console.log(`📦 Encontrados ${allBoats.length} boats`)

    for (const boat of allBoats) {
      // Obtener media asociada al boat
      const boatMedia = await db
        .select()
        .from(boatsMedia)
        .where(eq(boatsMedia.boatId, boat.id))

      const sanityDoc = {
        _type: 'boat',
        _id: `boat-${boat.id}`,
        id: boat.id,
        name: boat.name,
        partner: {
          _type: 'reference',
          _ref: `partner-${boat.partnerId}`,
        },
        size: parseFloat(boat.size),
        capacity: boat.capacity,
        features: boat.features,
        type: boat.type,
        isPopular: boat.isPopular,
        isActive: boat.isActive,
        media: boatMedia.map((m) => ({
          _type: 'object',
          _key: `media-${m.id}`,
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          isFeatured: m.isFeatured,
        }))
      }

      await sanityClient.createOrReplace(sanityDoc)
      console.log(`✅ Boat migrado: ${boat.name} (ID: ${boat.id}) con ${boatMedia.length} media`)
    }

    // 3. Migrar Boat Plan Prices
    console.log('\n📦 Consultando boat plan prices...')
    const allPrices = await db.select().from(boatPlanPrices)
    console.log(`📦 Encontrados ${allPrices.length} boat plan prices`)

    for (const price of allPrices) {
      const sanityDoc = {
        _type: 'boat_plan_price',
        _id: `boat-plan-price-${price.id}`,
        id: price.id,
        boat: {
          _type: 'reference',
          _ref: `boat-${price.boatId}`,
        },
        planId: price.planId,
        basePrice: parseFloat(price.basePrice),
        freePax: price.freePax,
        pricePerPerson: price.pricePerPerson ? parseFloat(price.pricePerPerson) : null,
        duration: price.duration,
      }

      await sanityClient.createOrReplace(sanityDoc)
      console.log(`✅ Price migrado para boat ${price.boatId} (ID: ${price.id})`)
    }

    console.log('')
    console.log('🎉 Migración completada exitosamente!')
    console.log(`📊 Total migrado:`)
    console.log(`   - ${allPartners.length} partners`)
    console.log(`   - ${allBoats.length} boats`)
    console.log(`   - ${allPrices.length} boat plan prices`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    // Cerrar conexión
    await client.end()
  }
}

// Ejecutar migración
migrateToSanity()
  .then(() => {
    console.log('')
    console.log('✅ Script finalizado con éxito')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('❌ Script falló:', error)
    process.exit(1)
  })
