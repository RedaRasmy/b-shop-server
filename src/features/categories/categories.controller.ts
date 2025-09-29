import type { Request, Response, NextFunction } from 'express'
import { db } from '../../db'
import { categories } from '../../db/schema'
import { eq } from 'drizzle-orm'

// Add one product
export const addCategorie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [categorie] = await db.insert(categories).values(req.body).returning()
    res.status(201).json({ categorie })
  } catch {
    next({ message: 'Failed to add categorie', status: 500 })
  }
}

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
export const getCategorieById = async (
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

// Update a product
export const updateCategorie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorie = await db
      .update(categories)
      .set(req.body)
      .where(eq(categories.id, req.params.id!))
      .returning()
    res.status(201).json({ categorie })
  } catch {
    next({ message: 'Failed to update categorie', status: 500 })
  }
}

// Delete a categorie
export const deleteCategorie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [categorie] = await db
      .delete(categories)
      .where(eq(categories.id, req.params.id!))
      .returning({
        id: categories.id,
      })
    res.status(200).json({ productId: categorie?.id })
  } catch {
    next({ message: 'Failed to delete categorie', status: 500 })
  }
}

// Read all products in a categorie
export const getCategorieProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorieId = req.params.id! // validated
    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.categorieId, categorieId),
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
