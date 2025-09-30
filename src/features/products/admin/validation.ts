import { StatusSchema } from '@db/enums'
import z from 'zod'

const ImageSchema = z.object({
  alt: z.string().max(255, 'Alt is too long').optional().default(''),
  isPrimary: z.boolean(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'Image must be less than 10MB',
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed',
    ),
})

export const AddProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z
    .string()
    .min(1, 'Product slug is required')
    .max(255, 'Product slug is too long')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    ),
  description: z.string().min(1, 'Description is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  stock: z
    .string()
    .min(1, 'Stock is required')
    .regex(/^\d+$/, 'Stock must be an integer'),
  categoryId: z.string().min(1, 'Category is Required').uuid(),
  status: StatusSchema,
})

export type AddProduct = z.input<typeof AddProductSchema>
