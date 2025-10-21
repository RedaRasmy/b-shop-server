import {
  pgTable,
  uuid,
  text,
  integer,
  varchar,
  numeric,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { entityStatus, categories, images, reviews, cartItems } from '@tables'

const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull(),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  status: entityStatus().notNull(),
  createdAt,
  updatedAt,
})
export default products

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(images),
  reviews: many(reviews),
  cartItems: many(cartItems),
}))

export type IProduct = InferInsertModel<typeof products>
export type SProduct = InferSelectModel<typeof products>
