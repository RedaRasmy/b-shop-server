import { cartItems } from '../../../db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const InsertCartItemSchema = createInsertSchema(cartItems).omit({
  userId: true,
  id: true,
  addedAt: true,
})
export const SelectCartItemSchema = createSelectSchema(cartItems)
