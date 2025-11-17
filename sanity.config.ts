// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const ALLOWED_TYPES = ['boat', 'partner', 'boat_plan_price']

export default defineConfig({
  name: 'default',
  title: 'Cabovibes',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  
  basePath: '/studio',
  
  plugins: [
    structureTool({ structure }),
    visionTool()
  ],
  
  schema: {
    types: schema.types,
  },
  
  // Filtrar opciones de creación de documentos
  document: {
    newDocumentOptions: (prev, { currentUser, creationContext }) => {
      // Si no es admin, solo mostrar tipos permitidos
      const isAdmin = currentUser?.roles?.some((role: any) => role.name === 'administrator')
      
      if (!isAdmin) {
        return prev.filter((templateItem) => 
          ALLOWED_TYPES.includes(templateItem.templateId)
        )
      }
      
      return prev
    }
  }
})
