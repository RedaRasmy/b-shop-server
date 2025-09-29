import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import { relations, type InferInsertModel , type InferSelectModel} from 'drizzle-orm'
import { categories , images, reviews } from '../../../db/schema'

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
   images : many(images),
   reviews : many(reviews)
}))


export type IProduct = InferInsertModel<typeof products>
export type SProduct = InferSelectModel<typeof products>

