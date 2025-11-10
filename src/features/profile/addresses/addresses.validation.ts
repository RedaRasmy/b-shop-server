import { addresses } from '@db/schema'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const InsertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  customerId: true,
})

export const UpdateAddressSchema = createUpdateSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  customerId: true,
})
