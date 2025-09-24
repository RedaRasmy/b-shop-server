import { pgTable, uuid, integer } from 'drizzle-orm/pg-core'
import {
  relations,
  //   type InferInsertModel,
  //   type InferSelectModel,
} from 'drizzle-orm'
import { orders, products } from '.'

const orderItems = pgTable('order_items', {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  productId: uuid('product_id').references(() => products.id),
  quantity: integer().notNull().default(1),
  priceAtPurchase: integer('price_at_purchase').notNull(),
})
export default orderItems

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
