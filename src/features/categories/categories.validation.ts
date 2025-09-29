import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import categories from "./categories.table"

export const insertCategorieSchema = createInsertSchema(categories)

export const selectCategorieSchema = createSelectSchema(categories)