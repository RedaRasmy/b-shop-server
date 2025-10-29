import { getSortSchema } from '@utils/get-sort-schema'
import z from 'zod'

/// Query

export const AdminOrdersQuerySchema = z.object({
  // pagination
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  perPage: z.coerce
    .number()
    .int()
    .min(1, 'Per page must be at least 1')
    .max(100, 'Per page must be at most 100')
    .default(10),

  // searching
  search: z.string().min(1, 'Search must not be empty').max(100).optional(),

  // filters
  status: z
    .enum(['pending', 'processing', 'shipped', 'completed', 'canceled'])
    .optional(),

  // Sorting
  sort: getSortSchema(['customer', 'status', 'createdAt', 'total']),
})

export type AdminOrdersQuery = z.infer<typeof AdminOrdersQuerySchema>

// Update

export const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'completed', 'canceled']),
})
