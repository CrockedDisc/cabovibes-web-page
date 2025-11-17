// sanity/schemaTypes/plan.ts
import { defineType, defineField } from 'sanity'
import { Calendar } from 'lucide-react'

export default defineType({
  name: 'plan',
  title: 'Plans',
  type: 'document',
  icon: Calendar,
  fields: [
    defineField({
      name: 'id',
      title: 'Database ID',
      type: 'number',
      description: 'ID del plan en Supabase',
      readOnly: true,
      hidden: false, // Visible para referencia
    }),
    defineField({
      name: 'name',
      title: 'Nombre del Plan',
      type: 'string',
      description: 'Este campo se sincroniza automáticamente con la base de datos',
      readOnly: true,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Este campo se sincroniza automáticamente con la base de datos',
      readOnly: true,
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'id',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Sin nombre',
        subtitle: `Plan ID: ${subtitle}`,
      }
    }
  }
})
