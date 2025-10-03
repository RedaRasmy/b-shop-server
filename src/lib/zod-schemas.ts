import z from 'zod'

export const SlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(255, 'Slug is too long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
  )
