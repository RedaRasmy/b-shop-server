import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import users from "./profile.table"
import z from "zod"

export const insertUserSchema = createInsertSchema(users)

export const selectUserSchema = createSelectSchema(users)


export const PhoneSchema = z.string().min(9).max(16)
export const FullNameSchema = z.string().min(1).max(100)