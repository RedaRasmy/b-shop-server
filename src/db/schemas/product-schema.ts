import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'

export const products = pgTable('product', {
  id: uuid().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  description: text(),
  price: integer().notNull(),
  stock: integer().notNull().default(1),
  // categorie_id :
  createdAt,
  updatedAt,
})
