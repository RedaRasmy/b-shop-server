import { z } from 'zod'
import products from './tables/products.table'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { getSortSchema } from '@utils/get-sort-schema'

const SORTABLE_FIELDS = [
  'name',
  'price',
]

// Define the schema for the 'sort' parameter specifically
const SortSchema = getSortSchema(SORTABLE_FIELDS)

// Define the full query parameter schema
export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  perPage: z.coerce
    .number()
    .int()
    .min(1 , "Per page must be at least 1")
    .max(100, 'Per page must be at most 100')
    .default(10),

  search: z.string().min(1, 'Search must not be empty').max(100).optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),

  // Sorting field
  sort: SortSchema,
})

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>


//// 


export const uploadedFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.string().refine(type => type.startsWith('image/')),
  size: z.number().max(5 * 1024 * 1024), // 5MB
  filename: z.string(),
  path: z.string(),
});

export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)
