import { db } from '@db/index'
import { categories } from '@db/schema'
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm'
import { AdminCategoriesQuerySchema } from '@categories/admin/validation'
import { ICategory } from '@categories/categories.table'
import {
  makeGetEndpoint,
  makePostEndpoint,
  makeByIdEndpoint,
  makeUpdateEndpoint,
} from '@utils/wrappers'
import { InsertCategorySchema } from '@categories/categories.validation'

export const addCategory = makePostEndpoint(
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

export const getCategories = makeGetEndpoint(
  AdminCategoriesQuerySchema,
  async (req, res, next) => {
    try {
      const { sort, status, search } = req.query

      // 1. --- Build WHERE Clause for Filtering and Searching ---
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
    } catch {
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
  InsertCategorySchema,
  async (req, res, next) => {
    try {
      const categorie = await db
        .update(categories)
        .set(req.body)
        .where(eq(categories.id, req.params.id!))
        .returning()
      res.status(201).json(categorie)
    } catch {
      next({ message: 'Failed to update category', status: 500 })
    }
  },
)

export const deleteCategory = makeByIdEndpoint(async (req, res, next) => {
  try {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, req.params.id))

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Category not found',
      })
    }

    res.status(204).send()
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
