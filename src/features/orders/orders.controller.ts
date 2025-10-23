import { db } from '@db/index'
import { orders } from '@db/schema'
import { OrderInsertSchema } from '@orders/orders.validation'
import { makeBodyEndpoint } from '@utils/wrappers'

export const addOrder = makeBodyEndpoint(
  OrderInsertSchema,
  async (req, res, next) => {
    const userId = req.user?.id!
    const orderData = req.body

    try {
      const [order] = await db
        .insert(orders)
        .values({
          ...orderData,
          customerId: userId,
        })
        .returning()

      res.status(201).json(order)
    } catch (err) {
      next(err)
    }
  },
)
