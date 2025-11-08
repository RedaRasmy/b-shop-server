import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import categories from './categories.table'

export const InsertCategorySchema = createInsertSchema(categories)
export const SelectCategorySchema = createSelectSchema(categories)
export const UpdateCategorySchema = createUpdateSchema(categories)
