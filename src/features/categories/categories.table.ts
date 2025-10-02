import { pgTable, uuid, text, varchar } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { entityStatus, products } from '../../db/schema'

const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull().unique(),
  slug: varchar({length:255}).notNull().unique(),
  description: text().notNull(),
  status: entityStatus().notNull(),
  createdAt,
  updatedAt,
})
export default categories

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export type ICategory = InferInsertModel<typeof categories>
export type SCategory = InferSelectModel<typeof categories>
