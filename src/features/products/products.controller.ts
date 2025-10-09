import { db } from '@db/index'
import { products } from '@tables'
import { and, asc, count, desc, eq, ilike, isNotNull } from 'drizzle-orm'
import { IProduct } from './tables/products.table'
import { ProductsQuerySchema } from './products.validation'
import { makeByIdEndpoint, makeGetEndpoint } from '@utils/wrappers'
import { getInventoryStatus } from '@utils/get-inventory-status'
import logger from 'src/logger'

export const getProducts = makeGetEndpoint(
  ProductsQuerySchema,
  async (req, res, next) => {
    try {
      const { page, perPage, search, categoryId, sort } = req.query

      // Filtering conditions
      const where = (products: any, { eq, ilike, and }: any) => {
        const filters = []
        /// Default filters
        filters.push(eq(products.status, 'active'))
        filters.push(isNotNull(products.categoryId))

        // Optional
        if (categoryId) {
          filters.push(eq(products.categoryId, categoryId))
        }
        if (search) filters.push(ilike(products.name, `%${search}%`))
        return filters.length ? and(...filters) : undefined
      }

      // Sorting
      let orderBy: any
      const [field, direction] = sort.split(':') as [
        keyof IProduct,
        'asc' | 'desc',
      ]
      const sortDirection = direction.toLowerCase() === 'asc' ? asc : desc
      orderBy = sortDirection(products[field])

      // Fetch current page
      const filteredProducts = await db.query.products.findMany({
        where,
        with: { images: true, reviews: true, category: true },
        limit: perPage,
        offset: (page - 1) * perPage,
        orderBy,
      })

      let total: number | null = null
      let totalPages: number | null = null

      // Only compute total when page = 1
      if (page === 1) {
        const [{ totalCount }] = await db
          .select({ totalCount: count() })
          .from(products)
          .where(where(products, { eq, ilike, and }))
        total = totalCount
        totalPages = Math.ceil(totalCount / perPage)
      }

      const data = filteredProducts
        .filter((p) => p.category?.status === 'active')
        .map(({ status, stock, createdAt, updatedAt, category, ...p }) => ({
          ...p,
          inventoryStatus: getInventoryStatus(stock),
        }))

      res.json({
        data,
        page,
        perPage,
        total,
        totalPages,
      })
    } catch (err) {
      logger.error(err, 'Failed to get products')
      next({ message: 'Failed to fetch products', status: 500 })
    }
  },
)

export const getProductById = makeByIdEndpoint(async (req, res, next) => {
  try {
    const product = await db.query.products.findFirst({
      where: (products, { eq, and }) =>
        and(
          eq(products.id, req.params.id),
          eq(products.status, 'active'),
          isNotNull(products.categoryId),
        ),
      with: {
        images: true,
        reviews: true,
        category: true,
      },
    })
    if (!product || product.category?.status === 'inactive') {
      return res.status(404).send({
        message: 'Product Not Found',
      })
    }
    const { status, stock, createdAt, updatedAt, category, ...p } = product

    const data = {
      ...p,
      inventoryStatus: getInventoryStatus(stock),
    }
    res.status(200).json(data)
  } catch (err) {
    logger.error(err, 'Failed to get product')
    next({ message: 'Failed to fetch product', status: 500 })
  }
})
