import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { images, products } from '../db/schemas'
import { eq, inArray } from 'drizzle-orm'
import type { IFullProduct } from '../lib/types'

// Add one product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { images: productImages, ...productData }: IFullProduct = req.body
    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values(productData)
        .returning()
      const insertedImages = await tx
        .insert(images)
        .values(
          productImages.map((img) => ({ ...img, productId: product!.id })),
        )
        .returning()
      res.status(201).json({
        product: {
          ...product!,
          images: insertedImages.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
          })),
        },
      })
    })
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
    const { categorieId } = req.query
    if (categorieId && typeof categorieId === 'string') {
      const categorieProducts = await db.query.products.findMany({
        where: (products, { eq }) => eq(products.categorieId, categorieId),
        with: {
          images: {
            columns: {
              url: true,
              alt: true,
              id: true,
            },
          },
        },
      })
      res.status(200).json(categorieProducts)
    } else {
      const allProducts = await db.query.products.findMany({
        with: {
          images: {
            columns: {
              url: true,
              alt: true,
              id: true,
            },
          },
        },
      })
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
      with: {
        images: {
          columns: {
            url: true,
            alt: true,
            id: true,
          },
        },
      },
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
    const { images: newImages, ...productData }: IFullProduct = req.body
    const productId = req.params.id!

    await db.transaction(async (tx) => {
      const [product] = await tx
        .update(products)
        .set(productData)
        .where(eq(products.id, productId))
        .returning()

      // Fetch existing images
      const existingImages = await tx.query.images.findMany({
        where: (images, { eq }) => eq(images.productId, productId),
      })

      // Determine images to delete, update, and insert
      const newIds = newImages.filter((img) => img.id).map((img) => img.id!)
      const toDelete = existingImages.filter((img) => !newIds.includes(img.id))
      const toUpdate = newImages.filter((img) => img.id)
      const toInsert = newImages
        .filter((img) => !img.id)
        .map((img) => ({ ...img, productId }))

      // Delete removed images
      if (toDelete.length > 0) {
        await tx.delete(images).where(
          inArray(
            images.id,
            toDelete.map((img) => img.id),
          ),
        )
      }

      // Update existing images
      for (const img of toUpdate) {
        await tx
          .update(images)
          .set({ url: img.url, alt: img.alt })
          .where(eq(images.id, img.id!))
      }

      // Insert new images
      const insertedImages =
        toInsert.length > 0
          ? await tx.insert(images).values(toInsert).returning()
          : []

      res.status(201).json({
        product: {
          ...product!,
          images: [
            ...toUpdate,
            ...insertedImages.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
            })),
          ],
        },
      })
    })
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
    const productId = req.params.id!
    await db.transaction(async (tx) => {
      await tx.delete(products).where(eq(products.id, productId))
      await tx.delete(images).where(eq(images.productId, productId))

      res.status(200).json({ productId })
    })
  } catch {
    next({ message: 'Failed to delete product', status: 500 })
  }
}
