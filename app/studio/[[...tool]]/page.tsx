// app/studio/[[...tool]]/page.tsx
import { Studio } from './Studio'

// Asegura que la ruta del Studio se genere estáticamente
export const dynamic = 'force-static'

// Configura los meta tags correctos
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
