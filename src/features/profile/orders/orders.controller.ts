import { db } from '@db/index'
import { makeAuthEndpoint } from '@utils/wrappers'

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
