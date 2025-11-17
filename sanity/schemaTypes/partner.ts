// sanity/schemaTypes/partner.ts
import { UserStar } from "lucide-react";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "partner",
  title: "Partners",
  type: "document",
  icon: UserStar,
  fields: [
    defineField({
      name: "id",
      title: "Database ID",
      type: "number",
      description: "ID del partner en Supabase (generado automáticamente)",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "name",
      title: "Nombre del Partner",
      type: "string",
      readOnly: ({ document }) => {
        // Si el _id NO empieza con "drafts.", significa que ya fue publicado
        return !!(document?._id && !document._id.startsWith('drafts.'))
      },
      description: 'El nombre no se puede cambiar después de crear el partner',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phoneNumber",
      title: "Teléfono",
      type: "string",
      validation: (Rule) =>
        Rule.regex(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
          {
            name: "phone",
            invert: false,
          }
        ).error("Formato de teléfono inválido"),
    }),
  ],
  preview: {
    select: {
      title: "name",
      email: "email",
      phone: "phoneNumber",
    },
    prepare({ title, email, phone }) {
      return {
        title: title,
        subtitle: `${email || ""} ${phone ? `| ${phone}` : ""}`,
      };
    },
  },
});
