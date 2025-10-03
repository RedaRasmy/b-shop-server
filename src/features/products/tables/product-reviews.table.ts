import {
  pgTable,
  uuid,
  integer,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { products, users } from '../../../db/schema'

const reviews = pgTable(
  'reviews',
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.id, {
      onDelete: 'cascade',
    }),
    userId: uuid('user_id').notNull().references(() => users.id, {
      onDelete: 'cascade',
    }),
    rating: integer().notNull(),
    comment: varchar({ length: 500 }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('reviews_product_user_idx').on(table.productId, table.userId),
  ],
)
export default reviews

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))

export type IReview = InferInsertModel<typeof reviews>
export type SReview = InferSelectModel<typeof reviews>
