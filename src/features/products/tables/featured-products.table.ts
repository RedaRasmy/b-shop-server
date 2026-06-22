import { pgTable, uuid, uniqueIndex } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../../db/timestamps'
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm'
import { products } from '../../../db/schema'

const featuredProducts = pgTable(
  'featured_products',
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id, {
      onDelete: 'cascade',
    }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('f_product_product_id_idx').on(table.productId)],
)
export default featuredProducts

export const featuredProductsRelations = relations(
  featuredProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [featuredProducts.productId],
      references: [products.id],
    }),
  }),
)

export type IFeaturedProduct = InferInsertModel<typeof featuredProducts>
export type SFeaturedProduct = InferSelectModel<typeof featuredProducts>
