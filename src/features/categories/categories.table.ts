import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../db/timestamps'
import { relations, type InferInsertModel , type InferSelectModel } from 'drizzle-orm'
import {entityStatus, products} from '../../db/schema'

const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description : text().notNull(),
  status : entityStatus().notNull() ,
  createdAt,
  updatedAt,
})
export default categories

export const categoriesRelations = relations(categories,({many})=>({
   products : many(products)
}))


export type ICategory = InferInsertModel<typeof categories>
export type SCategory = InferSelectModel<typeof categories>