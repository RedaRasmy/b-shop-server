import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { products, categories, images } from './schemas'
import { z } from 'zod'

// products

const insertImageSchema = createInsertSchema(images).omit({
  createdAt: true,
  updatedAt: true
})

const insertProductSchema = createInsertSchema(products).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export const insertFullProductSchema = insertProductSchema.extend({
  images: z
    .array(
      insertImageSchema.omit({
        productId: true,
      })
    )
    .max(5),
})

export const selectProductSchema = createSelectSchema(products)

// categories
export const insertCategorieSchema = createInsertSchema(categories).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export const selectCategorieSchema = createSelectSchema(categories)
