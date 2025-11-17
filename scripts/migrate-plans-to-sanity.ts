// scripts/migrate-plans-to-sanity.ts
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(process.cwd(), '.env.local') })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { plans } from '@/db/schema'
import { createClient } from '@sanity/client'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function migratePlans() {
  console.log('🚀 Migrando Plans a Sanity...')

  try {
    const allPlans = await db.select().from(plans)
    console.log(`📦 Encontrados ${allPlans.length} plans`)

    for (const plan of allPlans) {
      const sanityDoc = {
        _type: 'plan',
        _id: `plan-${plan.id}`,
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
      }

      await sanityClient.createOrReplace(sanityDoc)
      console.log(`✅ Plan migrado: ${plan.name} (ID: ${plan.id})`)
    }

    console.log('🎉 Migración de plans completada!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

migratePlans()
  .then(() => {
    console.log('✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script falló:', error)
    process.exit(1)
  })
