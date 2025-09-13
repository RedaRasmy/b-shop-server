import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { products , categories } from "./schemas";

// products
export const insertProductSchema = createInsertSchema(products).omit({
    createdAt : true,
    updatedAt : true,
    id : true
});
export const selectProductSchema = createSelectSchema(products);

// categories
export const insertCategorieSchema = createInsertSchema(categories).omit({
    createdAt: true,
    updatedAt : true,
    id : true
})

export const selectCategorieSchema = createSelectSchema(categories)