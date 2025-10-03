import { StatusSchema } from '@db/enums'
import { SlugSchema } from '@lib/zod-schemas'
import { getSortSchema } from '@utils/get-sort-schema'
import z from 'zod'

/// Insert / Update

const ImageSchema = z.object({
  id: z.string().min(1).optional(), // for update
  alt: z.string().max(255, 'Alt is too long').optional().default(''),
  isPrimary: z.coerce.boolean(),
  url: z.string().min(1).optional(), // for update
  file : z.any().optional()
})

export const AddProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: SlugSchema,
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(1, 'Price must be positive'),
  stock: z.coerce
    .number()
    .int('Stock must be an Integer')
    .min(0, 'Stock must be positive'),
  categoryId: z.uuid('Category ID is required and must be an UUID'),
  status: StatusSchema,
  images: z.array(ImageSchema).min(1, 'At least 1 product image is required'),
})

export type AddProduct = z.infer<typeof AddProductSchema>

/// Query

const SORTABLE_FIELDS = [
  'name',
  'price',
  'stock',
  'status',
  'createdAt',
  'updatedAt',
]

const SortSchema = getSortSchema(SORTABLE_FIELDS)

export const AdminProductsQuerySchema = z.object({
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
  categoryId: z.string().uuid('Invalid category ID').optional(),
  status: StatusSchema.optional(),

  // Sorting
  sort: SortSchema,
})

export type AdminProductsQuery = z.infer<typeof AdminProductsQuerySchema>
