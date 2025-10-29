import { db } from '@db/index'
import { AdminOrdersQuerySchema } from '@orders/admin/validation'
import { makeQueryEndpoint } from '@utils/wrappers'
import { orders } from '@db/schema'
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import { SOrder } from '@orders/tables/orders.table'

export const getOrders = makeQueryEndpoint(
  AdminOrdersQuerySchema,
  async (req, res, next) => {
    const { page, perPage, sort, search, status } = req.validatedQuery

    // Build Where Clause

    const where = (orders: any, { eq, ilike, and, or }: any) => {
      const filters = []

      if (status) filters.push(eq(orders.status, status))
      if (search)
        filters.push(
          or(
            ilike(orders.id, `%${search}%`),
            ilike(orders.name, `%${search}%`),
          ),
        )

      return and(...filters)
    }

    // Build OrderBy Clause

    const [field, direction] = sort.split(':')
    const orderBy =
      direction === 'asc'
        ? asc(orders[field as keyof SOrder])
        : desc(orders[field as keyof SOrder])

    try {
      // Compute total only in first page

      let total: number | null = null
      let totalPages: number | null = null

      if (page === 1) {
        const [{ totalCount }] = await db
          .select({ totalCount: count() })
          .from(orders)
          .where(where(orders, { eq, ilike, and, or }))
        total = totalCount
        totalPages = Math.ceil(totalCount / perPage)
      }

      const data = await db.query.orders.findMany({
        with: {
          items: {
            columns: {
              id: true,
              productId: true,
              priceAtPurchase: true,
              quantity: true,
            },
          },
        },
        where,
        orderBy,
        offset: (page - 1) * perPage,
        limit: perPage,
      })

      res.json({
        total,
        totalPages,
        data,
        page,
        perPage,
      })
    } catch (err) {
      next(err)
    }
  },
)
