import { z } from 'zod'
import { SProduct } from '../db/schemas/product-schema'

const SORTABLE_FIELDS = [
  'name',
  'price',
  'createdAt',
  'updatedAt',
  'slug',
  'stock',
] as const satisfies readonly (keyof SProduct)[]

// Define the schema for the 'sort' parameter specifically
const sortSchema = z
  .string()
  .regex(/^[^:]+:(asc|desc)$/, {
    message:
      "Sort parameter must be in 'field:direction' format (e.g., 'name:asc')",
  })
  .refine(
    (val) => {
      const [field] = val.split(':')
      return SORTABLE_FIELDS.includes(field as any)
    },
    {
      message: `Invalid sortable field. Allowed: ${SORTABLE_FIELDS.join(', ')}`, // 🔧 Better error message
    },
  )
  .default('createdAt:desc')

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
  sort: sortSchema,
})

// Extract the inferred type for use in your handler
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>
