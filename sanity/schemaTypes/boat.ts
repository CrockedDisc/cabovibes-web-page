// sanity/schemaTypes/boat.ts
import { defineType, defineField } from 'sanity'
import { ShipWheel } from 'lucide-react'

export default defineType({
  name: 'boat',
  title: 'Boats',
  type: 'document',
  icon: ShipWheel,
  fields: [
    defineField({
      name: 'id',
      title: 'Database ID',
      type: 'number',
      description: 'ID del barco en Supabase (generado automáticamente)',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'name',
      title: 'Nombre del Barco',
      type: 'string',
      // ⭐ ReadOnly solo después de publicar
      readOnly: ({ document }) => {
        return !!(document?._id && !document._id.startsWith('drafts.'))
      },
      description: 'El nombre no se puede cambiar después de crear el barco',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'partner',
      title: 'Partner',
      type: 'reference',
      to: [{ type: 'partner' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'size',
      title: 'Tamaño (pies)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'capacity',
      title: 'Capacidad de Personas',
      type: 'number',
      validation: Rule => Rule.required().integer().positive()
    }),
    defineField({
      name: 'type',
      title: 'Tipo de Barco',
      type: 'string',
      options: {
        list: [
          { title: 'Viking', value: 'Viking' },
          { title: 'Superpanga', value: 'Superpanga' },
          { title: 'Sport Fisher', value: 'Sport Fisher' },
          { title: 'Sport Fishing Boat', value: 'Sport Fishing Boat' },
          { title: 'Luxury Yacht', value: 'Luxury Yacht' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'Luxury Yacht',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'text',
      description: 'Descripción de las características del barco',
      rows: 4
    }),
    defineField({
      name: 'isPopular',
      title: '¿Es Popular?',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'isActive',
      title: '¿Está Activo?',
      type: 'boolean',
      initialValue: true,
      description: 'Los barcos inactivos no aparecerán en el sitio web'
    }),
    defineField({
      name: 'media',
      title: 'Imágenes y Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'mediaUrl',
              title: 'URL del Media',
              type: 'url',
              description: 'URL de Supabase Storage'
            },
            {
              name: 'mediaType',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Imagen', value: 'image' },
                  { title: 'Video', value: 'video' }
                ]
              }
            },
            {
              name: 'isFeatured',
              title: '¿Es Destacada?',
              type: 'boolean',
              initialValue: false
            }
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              mediaUrl: 'mediaUrl',
              isFeatured: 'isFeatured'
            },
            prepare({ mediaType, mediaUrl, isFeatured }) {
              return {
                title: `${mediaType === 'image' ? '🖼️' : '🎥'} ${isFeatured ? '⭐' : ''}`,
                subtitle: mediaUrl
              }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
      capacity: 'capacity',
      isActive: 'isActive'
    },
    prepare({ title, type, capacity, isActive }) {
      return {
        title: title,
        subtitle: `${type} - Capacidad: ${capacity} personas ${!isActive ? '(Inactivo)' : ''}`
      }
    }
  }
})
