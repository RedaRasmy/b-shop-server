import { products, users } from '@db/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

const cartItems = pgTable('cart_items', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  productId: uuid()
    .references(() => products.id)
    .notNull(),
  quantity: integer().notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
})

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export default cartItems

export type ICartItem = InferInsertModel<typeof cartItems>
export type SCartItem = InferSelectModel<typeof cartItems>
