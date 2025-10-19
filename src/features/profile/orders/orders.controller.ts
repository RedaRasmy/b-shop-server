import { db } from '@db/index'
import { orders } from '@db/schema'
import { OrderInsertSchema } from '@profile/orders/orders.validation'
import { makeAuthEndpoint, makeBodyEndpoint } from '@utils/wrappers'

/// POST

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

/// GET

export const getOrders = makeAuthEndpoint(async (req, res, next) => {
  const userId = req.user.id

  try {
    const customerOrders = await db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.customerId, userId),
      with: {
        items: {
          columns: {
            priceAtPurchase: true,
            productId: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })

    const data = customerOrders.map(({ items, ...order }) => ({
      ...order,
      items: items.map(({ product, ...item }) => ({
        ...item,
        productName: product.name,
      })),
    }))

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

// TODO
/// PATCH ( to cancel )
