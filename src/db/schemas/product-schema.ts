import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import { relations, type InferInsertModel , type InferSelectModel} from 'drizzle-orm'
import { categories } from '.'

const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  price: integer().notNull(),
  stock: integer().notNull().default(1),
  categorie_id : uuid().notNull().references(() => categories.id),
  createdAt,
  updatedAt,
})
export default products

export const productsRelations = relations(products,({one})=>({
   categorie : one(categories, {
    fields : [products.categorie_id],
    references: [categories.id]
   })
}))


export type IProduct = InferInsertModel<typeof products>

export type SProduct = InferSelectModel<typeof products>
