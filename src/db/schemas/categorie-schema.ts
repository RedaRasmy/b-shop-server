import { pgTable, uuid, text , boolean} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import { relations, type InferInsertModel , type InferSelectModel} from 'drizzle-orm'
import {products} from '.'
import type { UnusedAttributes } from '../../lib/types'

const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  isActive : boolean().notNull() ,
  createdAt,
  updatedAt,
})
export default categories

export const categoriesRelations = relations(categories,({many})=>({
   products : many(products)
}))


export type ICategorie = Omit<InferInsertModel<typeof categories>,UnusedAttributes>

export type SCategorie = InferSelectModel<typeof categories>