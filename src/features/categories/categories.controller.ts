import { db } from '../../db'
import {
  makeByIdEndpoint,
  makeSimpleEndpoint,
} from '../../utils/wrappers'
import { getInventoryStatus } from '../../utils/get-inventory-status'

export const getCategories = makeSimpleEndpoint(async (req, res, next) => {
  try {
    const result = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.status, 'active'),
    })

    // remove status column
    const data = result.map(({ status, ...cat }) => cat)

    res.status(200).json(data)
  } catch {
    next({ message: 'Failed to fetch categories', status: 500 })
  }
})

export const getCategoryById = makeByIdEndpoint(async (req, res, next) => {
  const id = req.params.id
  try {
    const result = await db.query.categories.findFirst({
      where: (categories, { eq, and }) =>
        and(eq(categories.id, id), eq(categories.status, 'active')),
    })

    if (!result) {
      return res.status(404).json({
        message: 'Category Not Found!',
      })
    }

    /// remove status
    const { status, ...category } = result

    res.status(200).json(category)
  } catch {
    next({ message: 'Failed to fetch category', status: 500 })
  }
})

export const getCategoryProducts = makeByIdEndpoint(async (req, res, next) => {
  const id = req.params.id
  try {
    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.categoryId, id),
      with: {
        images: true,
        reviews: true,
        category: true,
      },
    })

    const isForbidden = products[0].category!.status === 'inactive'

    if (isForbidden) {
      return res.status(404).json({
        message: 'Category Not Found!',
      })
    }

    // remove unwanted data and add inventoryStatus
    const data = products.map(
      ({ category, status, stock, createdAt, updatedAt, ...p }) => ({
        ...p,
        inventoryStatus: getInventoryStatus(stock),
      }),
    )

    res.status(200).json(data)
  } catch {
    next({
      message: 'Failed to fetch category products',
      status: 500,
    })
  }
})
