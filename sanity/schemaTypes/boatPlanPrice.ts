// sanity/schemaTypes/boatPlanPrice.ts
import { defineType, defineField } from 'sanity'
import { DollarSign } from 'lucide-react'

export default defineType({
  name: 'boat_plan_price',
  title: 'Boat Plan Prices',
  type: 'document',
  icon: DollarSign,
  fields: [
    defineField({
      name: 'id',
      title: 'Database ID',
      type: 'number',
      description: 'ID en Supabase (generado automáticamente)',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'boat',
      title: 'Barco',
      type: 'reference',
      to: [{ type: 'boat' }],
      validation: Rule => Rule.required()
    }),
    // ⭐ CAMBIAR: De number a reference
    defineField({
      name: 'plan',
      title: 'Plan',
      type: 'reference',
      to: [{ type: 'plan' }],
      description: 'Selecciona el plan turístico',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'basePrice',
      title: 'Precio Base',
      type: 'number',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'freePax',
      title: 'Personas Gratis',
      type: 'number',
      validation: Rule => Rule.required().integer().min(0)
    }),
    defineField({
      name: 'pricePerPerson',
      title: 'Precio por Persona Adicional',
      type: 'number',
      validation: Rule => Rule.positive()
    }),
    defineField({
      name: 'duration',
      title: 'Duración',
      type: 'string',
      description: 'Formato: HH:MM:SS (ej: 04:00:00 para 4 horas)',
      initialValue: '04:00:00',
      validation: Rule => Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        name: 'time',
        invert: false
      }).error('Formato inválido. Use HH:MM:SS')
    })
  ],
  preview: {
    select: {
      boatName: 'boat.name',
      planName: 'plan.name', // ⭐ ACTUALIZADO
      basePrice: 'basePrice',
      freePax: 'freePax'
    },
    prepare({ boatName, planName, basePrice, freePax }) {
      return {
        title: `${boatName || 'Sin barco'} - ${planName || 'Sin plan'}`,
        subtitle: `$${basePrice} | ${freePax} personas gratis`
      }
    }
  }
})
