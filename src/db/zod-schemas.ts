import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { products, categories , users } from './schemas'
import { z } from 'zod'

// products

// const insertImageSchema = createInsertSchema(images).omit({
//   createdAt: true,
//   updatedAt: true
// })

export const uploadedFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.string().refine(type => type.startsWith('image/')),
  size: z.number().max(5 * 1024 * 1024), // 5MB
  filename: z.string(),
  path: z.string(),
});

const insertProductSchema = createInsertSchema(products).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export const insertFullProductSchema = insertProductSchema.extend({
  images: z
    .array(
      z.object({
        id : z.string().uuid().optional(),
        alt: z.string().min(1, "Alt text is required").max(200, "Alt text too long"),
        position : z.int()
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


// users
export const insertUserSchema = createInsertSchema(users)

export const selectUserSchema = createSelectSchema(users)