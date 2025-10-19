import { pgTable, uuid, integer } from 'drizzle-orm/pg-core'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { orders, products } from '@tables'

const orderItems = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantity: integer().notNull().default(1),
  priceAtPurchase: integer('price_at_purchase').notNull(),
})
export default orderItems

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export type IOrderItem = InferInsertModel<typeof orderItems>
export type SOrderItem = InferSelectModel<typeof orderItems>
