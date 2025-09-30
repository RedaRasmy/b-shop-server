import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import categories from "./categories.table"

export const InsertCategorySchema = createInsertSchema(categories)
export const SelectCategorySchema = createSelectSchema(categories)