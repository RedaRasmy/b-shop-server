import { users } from '../../../db/schema'
import { createdAt, updatedAt } from '../../../db/timestamps'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { boolean, index, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

const addresses = pgTable('addresses', {
  id: uuid().primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => users.id)
    .notNull(),
  label: varchar({ length: 50 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  addressLine1: varchar('address_line_1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt,
  updatedAt,
},(table)=>[
  index('customer_id_index').on(table.customerId)
])

export const addressesRelations = relations(addresses, ({ one , many }) => ({
  customer: one(users, {
    fields: [addresses.customerId],
    references: [users.id],
  }),
}))

export default addresses

export type IAddress = InferInsertModel<typeof addresses>
export type SAddress = InferSelectModel<typeof addresses>
