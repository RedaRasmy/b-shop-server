import { db } from '../../db/index'
import { cartItems, orderItems, orders } from '../../db/schema'
import { OrderInsertSchema } from './orders.validation'
import { makeBodyEndpoint, makeParamsEndpoint } from '../../utils/wrappers'
import { eq } from 'drizzle-orm'

export const addOrder = makeBodyEndpoint(
  OrderInsertSchema,
  async (req, res, next) => {
    const userId = req.user?.id

    const { items, ...orderData } = req.body

    const productIds = items.map((item) => item.productId)

    try {
      // get products
      const products = await db.query.products.findMany({
        where: (products, { inArray }) => inArray(products.id, productIds),
        with: {
          category: true,
        },
      })

      // check if all products exists and active

      type Product = (typeof products)[number]

      const isInactive = (p: Product) =>
        p.status === 'inactive' || p.category?.status === 'inactive'

      if (products.length !== productIds.length || products.some(isInactive)) {
        return res.status(400).json({
          message: 'Some products not found',
        })
      }

      // construct order items
      const orderItemsData = items.map((item) => {
        const { price } = products.find((p) => p.id === item.productId)!

        return {
          priceAtPurchase: price,
          quantity: item.quantity,
          productId: item.productId,
        }
      })

      // calc total
      const total = orderItemsData.reduce(
        (acc, item) =>
          acc + Number(item.priceAtPurchase) * (item.quantity ?? 1),
        0,
      )

      await db.transaction(async (tx) => {
        const [order] = await tx
          .insert(orders)
          .values({
            ...orderData,
            customerId: userId,
            total: String(total), // Safe
          })
          .returning()

        // store items ( add orderId in each row )
        await tx
          .insert(orderItems)
          .values(orderItemsData.map((i) => ({ ...i, orderId: order.id })))

        // clear cart if logged-in
        if (userId) {
          await tx.delete(cartItems).where(eq(cartItems.userId, userId))
        }

        res.status(201).json(order)
      })
    } catch (err) {
      next(err)
    }
  },
)

export const getOrder = makeParamsEndpoint(
  ['orderToken'],
  async (req, res, next) => {
    const orderToken = req.params.orderToken

    try {
      const order = await db.query.orders.findFirst({
        where: (orders, { eq }) => eq(orders.orderToken, orderToken),
      })

      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        })
      }

      res.status(200).json({
        total: order.total,
        id: order.id,
      })
    } catch (err) {
      next(err)
    }
  },
)
