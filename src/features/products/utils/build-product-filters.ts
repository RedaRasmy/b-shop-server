import { ProductsQuery } from '../../products/products.validation'
import { exists, isNotNull, notExists } from 'drizzle-orm'
import featuredProducts from '../tables/featured-products.table'
import { db } from '../../../db'

export function buildProductFilters({
  search,
  categoryId,
  featured,
}: Pick<ProductsQuery, 'search' | 'categoryId' | 'featured'>) {
  return (products: any, { eq, ilike, and }: any) => {
    const filters = [
      eq(products.status, 'active'),
      isNotNull(products.categoryId),
      eq(products.isDeleted, false),
    ]

    if (categoryId) filters.push(eq(products.categoryId, categoryId))
    if (search) filters.push(ilike(products.name, `%${search}%`))

    if (featured) {
      filters.push(
        exists(
          db
            .select()
            .from(featuredProducts)
            .where(eq(featuredProducts.productId, products.id)),
        ),
      )
    }
    if (featured === false) {
      filters.push(
        notExists(
          db
            .select()
            .from(featuredProducts)
            .where(eq(featuredProducts.productId, products.id)),
        ),
      )
    }

    return and(...filters)
  }
}
