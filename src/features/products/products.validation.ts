import { z } from 'zod'
import products from './tables/products.table'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { getSortSchema } from '@utils/get-sort-schema'

const SORTABLE_FIELDS = [
  'price',
  'createdAt'
]

const SortSchema = getSortSchema(SORTABLE_FIELDS)


export const ProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  perPage: z.coerce
    .number()
    .int()
    .min(1 , "Per page must be at least 1")
    .max(100, 'Per page must be at most 100')
    .default(20),

  search: z.string().min(1, 'Search must not be empty').max(100).optional(),
  categoryId: z.uuid('Invalid category ID').optional(),

  sort: SortSchema,
})

export type ProductsQuery = z.infer<typeof ProductsQuerySchema>


////

export const insertProductSchema = createInsertSchema(products)
export const selectProductSchema = createSelectSchema(products)
