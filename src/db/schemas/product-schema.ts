import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import type { InferInsertModel , InferSelectModel} from 'drizzle-orm'

export const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull(),
  description: text(),
  price: integer().notNull(),
  stock: integer().notNull().default(1),
  // categorie_id :
  createdAt,
  updatedAt,
})


export type IProduct = InferInsertModel<typeof products>

export type SProduct = InferSelectModel<typeof products>
