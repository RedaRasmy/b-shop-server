import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { products } from '../db/schemas'
import { eq } from 'drizzle-orm'

// Add one product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [product] = await db.insert(products).values(req.body).returning()
    res.status(201).json({ product })
  } catch {
    next({ message: 'Failed to add product', status: 500 })
  }
}

// Read all products
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {categorieId} = req.query
    if (categorieId && typeof categorieId === "string") {
      const categorieProducts = await db.query.products.findMany({
        where : (products,{eq}) => eq(products.categorie_id,categorieId)
      })
      res.status(200).json(categorieProducts)
    } else {
      const allProducts = await db.query.products.findMany()
      res.status(200).json(allProducts)
    }
  } catch {
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
    })
    res.status(200).json({ product })
  } catch {
    next({ message: 'Failed to fetch product', status: 500 })
  }
}

// Update a product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await db
      .update(products)
      .set(req.body)
      .where(eq(products.id, req.params.id!))
      .returning()
    res.status(201).json({ product })
  } catch {
    next({ message: 'Failed to update product', status: 500 })
  }
}

// Delete an item
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [product] = await db
      .delete(products)
      .where(eq(products.id, req.params.id!))
      .returning({
        id: products.id,
      })
    res.status(200).json({ productId: product?.id })
  } catch {
    next({ message: 'Failed to delete product', status: 500 })
  }
}
