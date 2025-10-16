import { db } from '@db/index'
import { cartItems } from '@db/schema'
import { isNewProduct } from '@products/utils/is-new'
import { InsertCartItemSchema } from '@profile/cart/cart.validation'
import { formatNumber } from '@utils/format-number'
import { getInventoryStatus } from '@utils/get-inventory-status'
import {
  makeByIdEndpoint,
  makePostEndpoint,
  makeSimpleEndpoint,
  makeUpdateEndpoint,
} from '@utils/wrappers'
import { and, eq, sql } from 'drizzle-orm'
import logger from 'src/logger'
import z from 'zod'

export const getCart = makeSimpleEndpoint(async (req, res, next) => {
  const userId = req.user?.id!
  try {
    const cart = await db.query.cartItems.findMany({
      where: (cartItems, { eq }) => eq(cartItems.userId, userId),
      columns: {
        id: true,
        addedAt: true,
        productId: true,
        quantity: true,
      },
      with: {
        product: {
          columns: {
            id: true,
            name: true,
            slug: true,
            price: true,
            categoryId: true,
            createdAt: true,
            status: true,
            stock: true,
          },
          with: {
            images: {
              where: (images, { eq }) => eq(images.isPrimary, true),
              columns: {
                url: true,
              },
            },
            reviews: {
              columns: {
                rating: true,
              },
            },
            category: {
              columns: {
                status: true,
              },
            },
          },
        },
      },
    })

    const shouldBeActive = ({
      product: { status, category },
    }: (typeof cart)[number]) =>
      status === 'active' && category && category.status === 'active'

    const data = cart
      .filter(shouldBeActive)
      .map(
        ({
          product: {
            images,
            reviews,
            createdAt,
            status,
            category,
            stock,
            ...productData
          },
          quantity,
        }) => ({
          quantity,
          ...productData,
          thumbnailUrl: images[0].url,
          reviewCount: reviews.length,
          isNew: isNewProduct(createdAt),
          inventoryStatus: getInventoryStatus(stock),
          averageRating:
            reviews.length === 0
              ? null
              : formatNumber(
                  reviews.reduce((acc, { rating }) => acc + rating, 0) /
                    reviews.length,
                ),
        }),
      )

    res.status(200).json(data)
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

export const addCartItem = makePostEndpoint(
  InsertCartItemSchema,
  async (req, res, next) => {
    const data = req.body
    const userId = req.user?.id!
    try {
      // Check if product already in cart
      const existing = await db.query.cartItems.findFirst({
        where: (cartItems, { and, eq }) =>
          and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, data.productId),
          ),
      })

      if (existing) {
        return next({
          message: 'Product already in cart',
          status: 409, // Conflict
        })
      }

      const [cartItem] = await db
        .insert(cartItems)
        .values({ ...data, userId })
        .returning()

      res.status(201).json(cartItem)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  },
)

export const updateCartItem = makeUpdateEndpoint(
  InsertCartItemSchema.omit({ productId: true }),
  async (req, res, next) => {
    const productId = req.params.id
    const quantity = req.body.quantity
    const userId = req.user?.id!

    try {
      await db
        .update(cartItems)
        .set({ quantity })
        .where(
          and(eq(cartItems.productId, productId), eq(cartItems.userId, userId)),
        )

      res.status(204).send()
    } catch (error) {
      logger.error(error)
      next(error)
    }
  },
)

export const deleteCartItem = makeByIdEndpoint(async (req, res, next) => {
  const productId = req.params.id
  const userId = req.user?.id!

  try {
    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.productId, productId), eq(cartItems.userId, userId)),
      )
    res.status(204).send()
  } catch (err) {
    logger.error(err)
    next(err)
  }
})

export const clearCart = makeSimpleEndpoint(async (req, res, next) => {
  const userId = req.user?.id!
  try {
    await db.delete(cartItems).where(eq(cartItems.userId, userId))
    res.sendStatus(204)
  } catch (err) {
    logger.error(err)
    next(err)
  }
})

export const mergeCart = makePostEndpoint(
  z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, 'At least one item is required'),
  async (req, res, next) => {
    const userId = req.user?.id!
    const items = req.body

    try {
      await db
        .insert(cartItems)
        .values(
          items.map((item) => ({
            userId,
            productId: item.productId,
            quantity: item.quantity,
          })),
        )
        .onConflictDoUpdate({
          target: [cartItems.userId, cartItems.productId],
          set: {
            quantity: sql`${cartItems.quantity} + excluded.quantity`,
          },
        })

      res.sendStatus(200)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  },
)
