import { ProductsQuery } from "../../products/products.validation"
import { isNotNull } from "drizzle-orm"

export function buildProductFilters({ search, categoryId }: Pick<ProductsQuery,'search'|'categoryId'>) {
  return (products: any, { eq, ilike, and }: any) => {
    const filters = [
      eq(products.status, 'active'),
      isNotNull(products.categoryId),
      eq(products.isDeleted,false)
    ]

    if (categoryId) filters.push(eq(products.categoryId, categoryId))
    if (search) filters.push(ilike(products.name, `%${search}%`))

    return and(...filters)
  }
}
