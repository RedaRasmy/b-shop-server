import { pgTable, uuid, text, integer, varchar } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { products } from '../../../db/schema'

const images = pgTable('product_images', {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  url: text().notNull(),
  publicId: varchar('public_id', { length: 255 }),
  alt: text().notNull(),
  position: integer().notNull(),
  width: integer('width'),
  height: integer('height'),
  format: varchar('format', { length: 10 }), // jpg, png, etc.
  size: integer('size'), // file size in bytes
  createdAt,
  updatedAt,
})
export default images

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}))

export type IImage = InferInsertModel<typeof images>
export type SImage = InferSelectModel<typeof images>

export type Image = {
    id?:string
    alt : string
    position: number
}