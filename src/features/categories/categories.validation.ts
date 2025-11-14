import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import categories from './categories.table'

export const InsertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const SelectCategorySchema = createSelectSchema(categories)
export const UpdateCategorySchema = createUpdateSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
