import {
  pgTable,
  uuid,
  pgEnum,
  serial,
  varchar,
  numeric,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '@db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { orderItems, users } from '@tables'

export const orderStatus = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'completed',
  'canceled',
])

// export const paymentMethod = pgEnum('payment_method', ['COD', 'card'])
// Only COD for now

const orders = pgTable(
  'orders',
  {
    id: serial().primaryKey(),
    orderToken: uuid('order_token').defaultRandom().notNull(),
    customerId: uuid('customer_id').references(() => users.id),
    status: orderStatus().default('pending').notNull(),
    total: numeric({ precision: 10, scale: 2 }).notNull(),
    // shipping infos
    name: varchar('name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
    addressLine2: varchar('address_line_2', { length: 255 }),
    // timestamps
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('order_token_idx').on(table.orderToken)],
)

export default orders

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export type IOrder = InferInsertModel<typeof orders>
export type SOrder = InferSelectModel<typeof orders>
