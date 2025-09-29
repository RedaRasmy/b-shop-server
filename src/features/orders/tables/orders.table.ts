import { pgTable, uuid, text, integer, pgEnum, serial } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import {
  relations,
  //   type InferInsertModel,
  //   type InferSelectModel,
} from 'drizzle-orm'
import { orderItems, users } from '../../../db/schema'

export const orderStatus = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'completed',
  'canceled',
])

export const paymentMethod = pgEnum('payment_method', ['COD', 'card'])

const orders = pgTable('orders', {
  id: serial().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  status: orderStatus().default('pending').notNull(),
  total: integer().notNull(),
  shippingAddress: text('shipping_address').notNull(),
  paymentMethod: paymentMethod('payment_method').notNull(),
  createdAt,
  updatedAt,
})
export default orders

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))
