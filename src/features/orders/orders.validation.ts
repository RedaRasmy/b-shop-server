import { orders } from '@db/schema'
import { createInsertSchema } from 'drizzle-zod'

export const OrderInsertSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  customerId: true,
  status: true,
})
