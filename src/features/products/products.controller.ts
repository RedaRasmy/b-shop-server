import { db } from '@db/index'
import { categories, images, products, reviews } from '@tables'
import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm'
import { IProduct } from './tables/products.table'
import { ProductsQuerySchema } from './products.validation'
import { makeByIdEndpoint, makeGetEndpoint } from '@utils/wrappers'
import { getInventoryStatus } from '@utils/get-inventory-status'
import logger from 'src/logger'
import { buildProductFilters } from '@products/utils/build-product-filters'
import {  isNewProduct } from '@products/utils/is-new'

export const getProducts = makeGetEndpoint(
  ProductsQuerySchema,
  async (req, res, next) => {
    try {
      const {
        page = 1,
        perPage = 20,
        search,
        categoryId,
        sort = 'createdAt:desc',
      } = req.query

      const where = buildProductFilters({ search, categoryId })

      // Sorting
      let orderBy: any
      const [field, direction] = sort.split(':') as [
        keyof IProduct,
        'asc' | 'desc',
      ]
      const sortDirection = direction.toLowerCase() === 'asc' ? asc : desc
      orderBy = sortDirection(products[field])

      const filteredProducts = await db
        .select({
          id: products.id,
          slug: products.slug,
          name: products.name,
          price: products.price,
          createdAt: products.createdAt,
          categoryId: products.categoryId,
          reviewCount: sql<number>`cast(count (${reviews.id}) as integer)`.as(
            'review_count',
          ),
          averageRating: sql<number>`cast(AVG(${reviews.rating}) as float)`.as(
            'average_rating',
          ),
          thumbnailUrl: images.url,
        })
        .from(products)
        .where(where(products, { eq, ilike, and }))
        .innerJoin(
          categories,
          and(
            eq(categories.id, products.categoryId),
            eq(categories.status, 'active'),
          ),
        )
        .leftJoin(reviews, eq(products.id, reviews.productId))
        .leftJoin(
          images,
          and(eq(products.id, images.productId), eq(images.isPrimary, true)),
        )
        .groupBy(products.id, images.url)
        .offset((page - 1) * perPage)
        .limit(perPage)
        .orderBy(orderBy)

      let total: number | null = null
      let totalPages: number | null = null

      // Only compute total when page = 1
      if (page === 1) {
        const [{ totalCount }] = await db
          .select({ totalCount: count() })
          .from(products)
          .innerJoin(
            categories,
            and(
              eq(categories.id, products.categoryId),
              eq(categories.status, 'active'),
            ),
          )
          .where(where(products, { eq, ilike, and }))
        total = totalCount
        totalPages = Math.ceil(totalCount / perPage)
      }

      // add isNew
      const data = filteredProducts.map(({ createdAt, ...p }) => ({
        ...p,
        isNew: isNewProduct(createdAt),
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
  const isAdmin = req.user?.role === 'admin'
  const id = req.params.id
  try {
    /// NOTE : I used query instead of select because images and reviews are arrays
    // and select dont support this kind of joins
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, id),
      with: {
        images: true,
        reviews: {
          orderBy: desc(reviews.updatedAt),
        },
        category: true,
      },
    })

    if (!product) {
      /// 404 if not exist
      return res.status(404).send({
        message: 'Product Not Found',
      })
    }

    const isActive =
      product.status === 'active' && product.category?.status === 'active'

    const {
      createdAt,
      stock,
      category,
      status,
      updatedAt,
      images,
      reviews: productReviews,
      ...p
    } = product

    const reviewCount = product.reviews.length
    const averageRating =
      reviewCount === 0
        ? null
        : product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviewCount

    const data = {
      ...p,
      inventoryStatus: getInventoryStatus(stock),
      isNew: isNewProduct(createdAt),
      averageRating,
      reviewCount,
      categoryName: category?.name || '(deleted)',
      images: images.map((img) => ({
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        isPrimary: img.isPrimary,
        size: img.size,
      })),
      reviews: productReviews.map((rev) => ({
        id: rev.id,
        rating: rev.rating,
        comment: rev.comment,
        date: rev.updatedAt,
        edited: rev.updatedAt.getTime() !== rev.createdAt.getTime(),
      })),
    }

    if (isActive || isAdmin) {
      return res.status(200).json(data)
    }

    // if not admin and inactive
    res.status(404).send({
      message: 'Product Not Found',
    })
  } catch (err) {
    logger.error(err, 'Failed to get product')
    next({ message: 'Failed to fetch product', status: 500 })
  }
})
