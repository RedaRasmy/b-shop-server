import { StatusSchema } from "@db/enums";
import { getSortSchema } from "@utils/get-sort-schema";
import z from "zod";

const SortSchema = getSortSchema([
    'name' , 'status' , 'createdAt' ,'updatedAt'
])

export const CategoriesQuerySchema = z.object({
    status : StatusSchema.optional(),
    search: z.string().min(1, 'Search must not be empty').max(100).optional(),
    sort : SortSchema
})

export type CategoriesQuery = z.infer<typeof CategoriesQuerySchema>