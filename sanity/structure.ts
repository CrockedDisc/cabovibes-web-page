// sanity/structure.ts
import type { StructureResolver } from 'sanity/structure'
import { ShipWheel, UserStar, DollarSign } from 'lucide-react' 

// https://www.sanity.io/docs/structure-builder-cheat-sheet

// Lista de tipos de documentos permitidos para tu cliente
const ALLOWED_TYPES = ['boat', 'partner', 'boat_plan_price']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Cabovibes Content')
    .items([
      // Sección de Boats
      S.listItem()
        .title('Boats')
        .icon(ShipWheel)
        .child(
          S.documentTypeList('boat')
            .title('Boats')
            .filter('_type == "boat"')
        ),
      
      // Sección de Partners
      S.listItem()
        .title('Partners')
        .icon(UserStar)
        .child(
          S.documentTypeList('partner')
            .title('Partners')
            .filter('_type == "partner"')
        ),
      
      // Sección de Boat Plan Prices
      S.listItem()
        .title('Boat Plan Prices')
        .icon(DollarSign)
        .child(
          S.documentTypeList('boat_plan_price')
            .title('Boat Plan Prices')
            .filter('_type == "boat_plan_price"')
        ),
      
      // Divisor visual
      S.divider(),
      
      // Esto filtra y solo muestra los tipos permitidos
      // (útil si agregas más tipos en el futuro)
      ...S.documentTypeListItems().filter(
        (listItem) => {
          const id = listItem.getId()
          return id ? ALLOWED_TYPES.includes(id) : false
        }
      ),
    ])
