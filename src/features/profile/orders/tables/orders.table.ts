import {
  pgTable,
  uuid,
  text,
  integer,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '@db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { addresses, orderItems, users } from '@tables'

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
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  status: orderStatus().default('pending').notNull(),
  total: integer().notNull(),
  addressId: uuid('address_id').references(() => addresses.id).notNull(),
  paymentMethod: paymentMethod('payment_method').notNull(),
  createdAt,
  updatedAt,
})
export default orders

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
  address: one(addresses),
}))

export type IOrder = InferInsertModel<typeof orders>
export type SOrder = InferSelectModel<typeof orders>
