import type { Request, Response, NextFunction } from 'express'
import { db } from '@db/index'
import { products } from '@tables'
import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import { IProduct } from './tables/products.table'
import { GetProductsQuery } from './products.validation'


interface PRequest extends Request {
    validatedQuery?: any
}

export const getProducts = async (
  req: PRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, perPage, search, categoryId, sort } =
      req.validatedQuery as GetProductsQuery

    // Filtering conditions
    const where = (products: any, { eq, ilike, and }: any) => {
      const filters = []
      if (categoryId) filters.push(eq(products.categorieId, categoryId))
      if (search) filters.push(ilike(products.name, `%${search}%`))
      return filters.length ? and(...filters) : undefined
    }

    // Sorting
    let orderBy: any
    const [field, direction] = sort.split(':') as [
      keyof IProduct,
      'asc' | 'desc',
    ]
    orderBy =
      direction.toLowerCase() === 'asc'
        ? asc(products[field])
        : desc(products[field])

    // Fetch current page
    const filteredProducts = await db.query.products.findMany({
      where,
      with: { images: true },
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy,
    })

    let totalCount: number | null = null
    let totalPages: number | null = null

    // Only compute total when page = 1
    if (page === 1) {
      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(products)
        .where(where(products, { eq, ilike, and }))
      totalPages = Math.ceil(totalCount / perPage)
    }

    res.json({
      data: filteredProducts,
      page,
      perPage,
      total: totalCount,
      totalPages,
    })
  } catch (err) {
    next({ message: 'Failed to fetch products', status: 500 })
  }
}

// Read single product
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, req.params.id!),
      with: {
        images: true,
      },
    })
    res.status(200).json({ product })
  } catch {
    next({ message: 'Failed to fetch product', status: 500 })
  }
}

