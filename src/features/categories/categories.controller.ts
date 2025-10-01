import type { Request, Response, NextFunction } from 'express'
import { db } from '../../db'

// Read all products
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allCategories = await db.query.categories.findMany()
    res.status(200).json(allCategories)
  } catch {
    next({ message: 'Failed to fetch categories', status: 500 })
  }
}

// Read single product
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorie = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.id, req.params.id!),
    })
    res.status(200).json({ categorie })
  } catch {
    next({ message: 'Failed to fetch categorie', status: 500 })
  }
}

// Read all products in a categorie
export const getCategoryProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorieId = req.params.id! // validated
    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.categoryId, categorieId),
      with: {
        images: true,
      },
    })
    res.status(200).json(products)
  } catch {
    next({
      message: 'Failed to fetch categorie products',
      status: 500,
    })
  }
}
