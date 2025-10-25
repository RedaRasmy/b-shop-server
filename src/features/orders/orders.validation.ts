import { orderItems, orders } from '@db/schema'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'

export const OrderInsertSchema = createInsertSchema(orders)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    customerId: true,
    status: true,
    guestToken: true,
  })
  .extend({
    items: z.array(
      createInsertSchema(orderItems).omit({
        id: true,
        orderId: true,
        priceAtPurchase: true,
      }),
    ),
  })
