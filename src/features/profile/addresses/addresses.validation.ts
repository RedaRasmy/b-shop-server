import { addresses } from '@db/schema'
import { createInsertSchema } from 'drizzle-zod'

export const InsertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
