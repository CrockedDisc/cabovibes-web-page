// sanity/schemaTypes/index.ts
import boat from './boat'
import partner from './partner'
import boatPlanPrice from './boatPlanPrice'
import plan from './plan'

import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [boat, partner, boatPlanPrice, plan],
}
