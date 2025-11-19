import { getSortSchema } from '../../../utils/get-sort-schema'
import z from 'zod'

export const CustomersQuerySchema = z.object({
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

  // Sorting
  sort: getSortSchema(['orders', 'total', 'createdAt']).default(
    'createdAt:desc',
  ),
})

export type CustomersQuery = z.infer<typeof CustomersQuerySchema>
