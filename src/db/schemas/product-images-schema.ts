import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../timestamps'
import { relations, type InferInsertModel , type InferSelectModel} from 'drizzle-orm'
import {products} from '.'
import type { UnusedAttributes } from '../../lib/types'

const images = pgTable('product_images', {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id),
  url: text().notNull(),
  alt : text().notNull() ,
  createdAt,
  updatedAt,
})
export default images

export const imagesRelations = relations(images,({one})=>({
   product : one(products,{
    fields : [images.productId],
    references : [products.id]
   })
}))


export type IImage = Omit<InferInsertModel<typeof images>,UnusedAttributes>

export type SImage = InferSelectModel<typeof images>