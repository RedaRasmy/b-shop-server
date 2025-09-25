import { pgTable, uuid, integer, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import {
  relations,
  //   type InferInsertModel,
  //   type InferSelectModel,
} from 'drizzle-orm'
import { products, users } from '.'

const reviews = pgTable('reviews', {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id),
  userId: uuid('user_id').references(() => users.id),
  rating: integer().notNull(),
  comment: varchar({length:500}),
  createdAt,
  updatedAt,
},(table) => [
    uniqueIndex('reviews_product_user_idx').on(table.productId,table.userId)
])
export default reviews

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user : one(users,{
    fields : [reviews.userId],
    references : [users.id]
  })
}))
