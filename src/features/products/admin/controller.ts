import type { NextFunction, Request, Response } from 'express'
import products, { IProduct } from '../tables/products.table'
import images, { IImage, SImage } from '../tables/product-images.table'
import { deleteMultipleImages, uploadMultipleImages } from '@lib/cloudinary'
import { db } from '@db/index'
import { and, asc, count, desc, eq, ilike, inArray, isNull } from 'drizzle-orm'
import { AddProduct, AdminProductsQuery } from '@products/admin/validation'
import { getInventoryStatus } from '@utils/get-inventory-status'
import logger from 'src/logger'

/// ADD

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { images: productImages, ...productData }: AddProduct = req.body
  try {
    // Check if all files exists
    if (productImages.some((p) => !p.file)) {
      return res.status(400).json({
        message: 'One file or more are missing',
      })
    }

    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values(productData)
        .returning()

      // Upload files to Cloudinary first
      const uploadedFiles = await uploadMultipleImages(
        productImages.map((i) => i.file),
        `products/${product.id}`,
      )

      // Prepare image data with Cloudinary URLs
      const imageData: IImage[] = uploadedFiles.map((uploadResult, index) => ({
        productId: product.id,
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        alt: productImages[index].alt,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        isPrimary: productImages[index].isPrimary,
      }))

      const insertedImages = await tx
        .insert(images)
        .values(imageData)
        .returning()

      res.status(201).json({
        product: {
          ...product,
          images: insertedImages,
        },
      })
    })
  } catch (error: any) {
    logger.error(error, 'Failed to add product')

    const isUniqueSlugError =
      error?.cause?.code === '23505' &&
      error?.cause?.constraint === 'products_slug_unique'

    if (isUniqueSlugError) {
      return res.status(409).json({
        message: 'A product with this slug already exists.',
      })
    }

    next({ message: 'Failed to add product', status: 500 })
  }
}

/// GET

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, perPage, search, categoryId, sort, status } =
      req.validatedQuery as AdminProductsQuery

    // Filtering conditions
    const where = (products: any, { eq, ilike, and }: any) => {
      const filters = []
      if (categoryId) {
        if (categoryId === 'null') {
          // special case where category is deleted
          filters.push(isNull(products.categoryId))
        } else {
          filters.push(eq(products.categoryId, categoryId))
        }
      }
      if (search) filters.push(ilike(products.name, `%${search}%`))
      if (status) filters.push(eq(products.status, status))
      return filters.length ? and(...filters) : undefined
    }

    // Sorting
    let orderBy: any
    const [field, direction] = sort.split(':') as [
      keyof IProduct,
      'asc' | 'desc',
    ]
    const sortDirection = direction.toLowerCase() === 'asc' ? asc : desc
    orderBy = sortDirection(products[field])

    // Fetch current page
    const filteredProducts = await db.query.products.findMany({
      where,
      with: { images: true },
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy,
    })

    let total: number | null = null
    let totalPages: number | null = null

    // Only compute total when page = 1
    if (page === 1) {
      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(products)
        .where(where(products, { eq, ilike, and }))
      total = totalCount
      totalPages = Math.ceil(totalCount / perPage)
    }

    res.json({
      data: filteredProducts.map((p) => ({
        ...p,
        inventoryStatus: getInventoryStatus(p.stock),
      })),
      page,
      perPage,
      total,
      totalPages,
    })
  } catch (err) {
    logger.error(err, 'Failed to get products')
    next({ message: 'Failed to fetch products', status: 500 })
  }
}

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
    if (!product) {
      return res.status(404).send({
        message: 'Product Not Found',
      })
    }
    res
      .status(200)
      .json({ ...product, inventoryStatus: getInventoryStatus(product.stock) })
  } catch (err) {
    logger.error(err, 'Failed to get product')
    next({ message: 'Failed to fetch product', status: 500 })
  }
}

// UPDATE

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = req.params.id!
  const { images: productImages, ...productData } = req.body as AddProduct
  const newImages = productImages.filter((img) => img.file) // file exists => new
  const oldImages = productImages.filter((img) => img.id) // id exists => old

  try {
    await db.transaction(async (tx) => {
      // get products images
      const existingImages = await tx.query.images.findMany({
        where: (images, { eq }) => eq(images.productId, productId),
      })

      // Delete images from Cloudinary
      const oldImageIds = new Set(oldImages.map((i) => i.id))
      const deletedImages = existingImages.filter(
        (img) => !oldImageIds.has(img.id),
      )
      await deleteMultipleImages(deletedImages.map((img) => img.publicId))

      // Delete images from database
      await tx.delete(images).where(
        inArray(
          images.id,
          deletedImages.map((i) => i.id),
        ),
      )

      let insertedImages: SImage[] = []

      if (newImages.length > 0) {
        // Upload new images to cloudinary
        const uploadedFiles = await uploadMultipleImages(
          newImages.map((img) => img.file),
          `products/${productId}`,
        )

        // Insert new images to database
        const imagesData: IImage[] = uploadedFiles.map(
          (uploadResult, index) => ({
            productId: productId,
            url: uploadResult.url,
            publicId: uploadResult.public_id,
            alt: newImages[index].alt,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            size: uploadResult.bytes,
            isPrimary: newImages[index].isPrimary,
          }),
        )

        insertedImages = await db.insert(images).values(imagesData).returning()
      }

      /// update the product row

      const [product] = await db
        .update(products)
        .set(productData)
        .where(eq(products.id, productId))
        .returning()

      // send response
      res.status(200).json({
        message: 'Product updated successfully',
        product: {
          ...product!,
          images: [
            ...oldImages,
            ...insertedImages.map((i) => ({
              id: i.id,
              url: i.url,
              isPrimary: i.isPrimary,
              alt: i.alt,
            })),
          ],
        },
      })
    })
  } catch (error) {
    logger.error(error, 'Failed to update product')
    next({ message: 'Failed to update product', status: 500 })
  }
}

/// DELETE

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.id!
    await db.transaction(async (tx) => {
      const productImages = await tx.query.images.findMany({
        where: (images, { eq }) => eq(images.productId, productId),
      })
      // delete images from cloudinary
      await deleteMultipleImages(productImages.map((i) => i.publicId))

      await tx.delete(products).where(eq(products.id, productId))
      // images will be deleted automaticly (cascade)

      res.status(200).json({ productId })
    })
  } catch (err) {
    logger.error(err, 'Failed to delete product')
    next({ message: 'Failed to delete product', status: 500 })
  }
}
