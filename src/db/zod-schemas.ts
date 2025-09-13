import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products } from "./schemas";


export const insertProductSchema = createInsertSchema(products).omit({
    createdAt : true,
    updatedAt : true,
    id : true
});
export const selectProductSchema = createSelectSchema(products);
