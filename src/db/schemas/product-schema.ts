import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import { relations, type InferInsertModel , type InferSelectModel} from 'drizzle-orm'
import { categories , images } from '.'
import type { UnusedAttributes } from '../../lib/types'

const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  price: integer().notNull(),
  stock: integer().notNull(),
  categorieId : uuid("categorie_id").notNull().references(() => categories.id),
  createdAt,
  updatedAt,
})
export default products

export const productsRelations = relations(products,({one,many})=>({
   categorie : one(categories, {
    fields : [products.categorieId],
    references: [categories.id]
   }),
   images : many(images)
}))


export type IProduct = Omit<InferInsertModel<typeof products>,UnusedAttributes>

export type SProduct = InferSelectModel<typeof products>

