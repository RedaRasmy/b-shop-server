import { db } from '../../../db/index'
import { categories, products } from '../../../db/schema'
import { and, asc, desc, eq, ilike } from 'drizzle-orm'
import { AdminCategoriesQuerySchema } from '../../categories/admin/validation'
import { ICategory } from '../../categories/categories.table'
import {
  makeQueryEndpoint,
  makeBodyEndpoint,
  makeByIdEndpoint,
  makeUpdateEndpoint,
} from '../../../utils/wrappers'
import {
  InsertCategorySchema,
  UpdateCategorySchema,
} from '../../categories/categories.validation'
import logger from '../../../lib/logger'

export const addCategory = makeBodyEndpoint(
  InsertCategorySchema,
  async (req, res, next) => {
    try {
      const [category] = await db
        .insert(categories)
        .values(req.body)
        .returning()
      res.status(201).json(category)
    } catch {
      next({ message: 'Failed to add category', status: 500 })
    }
  },
)

export const getCategories = makeQueryEndpoint(
  AdminCategoriesQuerySchema,
  async (req, res, next) => {
    try {
      const { sort = 'createdAt:desc', status, search } = req.validatedQuery

      const conditions = []

      // Filter by Status (active/inactive)
      if (status) {
        conditions.push(eq(categories.status, status))
      }

      if (search) {
        // Use ilike for a general search across the category name
        conditions.push(ilike(categories.name, `%${search}%`))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // 2. --- Build ORDER BY Clause for Sorting ---
      const [sortField, sortDirection] = sort.split(':') as [
        keyof ICategory,
        'asc' | 'desc',
      ]

      // Determine sort direction (asc or desc)
      const orderByDirection =
        sortDirection === 'asc'
          ? asc(categories[sortField])
          : desc(categories[sortField])

      // 3. --- Fetch Data from DB ---
      const result = await db.query.categories.findMany({
        where: whereClause,
        orderBy: [orderByDirection],
        with: {
          products: {
            columns: {
              id: true,
            },
          },
        },
      })

      const response = result.map(({ products, ...cat }) => ({
        ...cat,
        productsCount: products.length,
      }))

      res.status(200).json(response)
    } catch (error) {
      logger.error(error)
      next({ message: 'Failed to fetch categories', status: 500 })
    }
  },
)

export const getCategoryById = makeByIdEndpoint(async (req, res, next) => {
  try {
    const result = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.id, req.params.id),
      with: {
        products: {
          columns: {
            id: true,
          },
        },
      },
    })

    const { products, ...category } = result!

    res.status(200).json({
      ...category,
      productsCount: products.length,
    })
  } catch {
    next({ message: 'Failed to fetch category', status: 500 })
  }
})

export const updateCategory = makeUpdateEndpoint(
  UpdateCategorySchema,
  async (req, res, next) => {
    const category = req.body
    const id = req.params.id
    try {
      await db.transaction(async (tx) => {
        const newData = await tx
          .update(categories)
          .set(category)
          .where(eq(categories.id, id))
          .returning()

        if (category.status === 'inactive') {
          await tx
            .update(products)
            .set({
              status: 'inactive',
            })
            .where(eq(products.categoryId, id))
        }

        res.status(200).json(newData)
      })
    } catch {
      next({ message: 'Failed to update category', status: 500 })
    }
  },
)

export const deleteCategory = makeByIdEndpoint(async (req, res, next) => {
  const categoryId = req.params.id
  try {
    await db.transaction(async (tx) => {
      const result = await tx
        .delete(categories)
        .where(eq(categories.id, categoryId))

      if (result.rowCount === 0) {
        res.status(404).json({
          message: 'Category not found',
        })
      } else {
        await tx
          .update(products)
          .set({
            status: 'inactive',
          })
          .where(eq(products.categoryId, categoryId))
        res.status(204).send()
      }
    })
  } catch {
    next({ message: 'Failed to delete category', status: 500 })
  }
})

export const getCategoryProducts = makeByIdEndpoint(async (req, res, next) => {
  try {
    const categoryId = req.params.id
    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.categoryId, categoryId),
      with: {
        images: true,
      },
    })
    res.status(200).json(products)
  } catch {
    next({
      message: 'Failed to fetch category products',
      status: 500,
    })
  }
})
