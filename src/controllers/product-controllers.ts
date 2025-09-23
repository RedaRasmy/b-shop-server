import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { images, products } from '../db/schemas'
import { eq } from 'drizzle-orm'
import type { IFullProduct } from '../lib/types'
import { deleteImage, deleteMultipleImages, uploadMultipleImages } from '../lib/cloudinary'

// Add one product
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { images: productImages, ...productData }: IFullProduct = req.body

  try {
    // Check if files are uploaded
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        error: 'At least one product image is required',
      })
    }

    // Check if productImages data matches uploaded files
    if (productImages.length !== req.files.length) {
      return res.status(400).json({
        error: 'Image metadata must match number of uploaded files',
      })
    }

    // Step 1: Upload files to Cloudinary first
    const uploadedFiles = await uploadMultipleImages(req.files, 'products')

    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values(productData)
        .returning()

      // Prepare image data with Cloudinary URLs
      const imageData = uploadedFiles.map((uploadResult, index) => ({
        productId: product!.id,
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        alt: productImages[index]!.alt,
        position: productImages[index]!.position,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
      }))

      const insertedImages = await tx
        .insert(images)
        .values(imageData)
        .returning()

      res.status(201).json({
        product: {
          ...product!,
          images: insertedImages.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            position : img.position,
          }))
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
          images: true 
        },
      })
      res.status(200).json(categorieProducts)
    } else {
      const allProducts = await db.query.products.findMany({
        with: {
          images: true,
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
        images: true,
      },
    })
    res.status(200).json({ product })
  } catch {
    next({ message: 'Failed to fetch product', status: 500 })
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
      const productImages = await tx.query.images.findMany({
        where : (images,{eq})=> eq(images.productId,productId)
      })
      productImages.forEach(async (img)=> {
        await deleteImage(img.publicId!)
      })
      
      await tx.delete(products).where(eq(products.id, productId))
      await tx.delete(images).where(eq(images.productId, productId))
      
      res.status(200).json({ productId })
    })
  } catch {
    next({ message: 'Failed to delete product', status: 500 })
  }
}

// Update a product by replacing it
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = req.params.id!;

  try {
    // Step 1: Delete existing product (this handles Cloudinary cleanup)
    await db.transaction(async (tx) => {
      // Get and delete images from Cloudinary
      const productImages = await tx.query.images.findMany({
        where: (images, { eq }) => eq(images.productId, productId)
      });

      // Delete images from Cloudinary
      await deleteMultipleImages(productImages.map(img=>img.publicId!))

      // Delete from database
      await tx.delete(images).where(eq(images.productId, productId));
      await tx.delete(products).where(eq(products.id, productId));
    });

    // Step 2: Create new product with the same ID
    const { images: productImages, ...productData }: IFullProduct = req.body;

    // Validation (same as addProduct)
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        error: 'At least one product image is required',
      });
    }

    if (productImages.length !== req.files.length) {
      return res.status(400).json({
        error: 'Image metadata must match number of uploaded files',
      });
    }

    // Upload new files
    const uploadedFiles = await uploadMultipleImages(req.files, 'products');

    await db.transaction(async (tx) => {
      // Insert product with the SAME ID to keep URLs working
      const [product] = await tx
        .insert(products)
        .values({
          ...productData,
          id: productId, // Keep same ID
        })
        .returning();

      // Insert new images
      const imageData = uploadedFiles.map((uploadResult, index) => ({
        productId: productId,
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        alt: productImages[index]!.alt,
        position: productImages[index]!.position,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
      }));

      const insertedImages = await tx
        .insert(images)
        .values(imageData)
        .returning();

      res.status(200).json({
        message: 'Product updated successfully',
        product: {
          ...product!,
          images: insertedImages.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            position: img.position,
          }))
        },
      });
    });

  } catch (error) {
    next({ message: 'Failed to update product', status: 500 });
  }
};
