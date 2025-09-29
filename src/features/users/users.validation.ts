import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import users from "./users.table"

export const insertUserSchema = createInsertSchema(users)

export const selectUserSchema = createSelectSchema(users)