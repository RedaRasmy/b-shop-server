import { db } from '@db/index'
import { cartItems, orderItems, orders } from '@db/schema'
import { OrderInsertSchema } from '@orders/orders.validation'
import { makeBodyEndpoint } from '@utils/wrappers'
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
      })

      // check if all products exists
      if (products.length !== productIds.length) {
        const foundIds = products.map((p) => p.id)
        const missingIds = productIds.filter((id) => !foundIds.includes(id))
        return res.status(400).json({
          message: 'Some products not found',
          missingProductIds: missingIds,
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
