import { db } from '@db/index'
import { orders, users } from '@db/schema'
import { CustomersQuerySchema } from '@profile/admin/validation'
import { makeQueryEndpoint } from '@utils/wrappers'
import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm'

export const getCustomers = makeQueryEndpoint(
  CustomersQuerySchema,
  async (req, res, next) => {
    try {
      const { page, perPage, search, sort } = req.validatedQuery

      // Build Where Clause

      const where = (users: any, { ilike, and, or }: any) => {
        const filters = [eq(users.role, 'customer')]

        if (search) {
          filters.push(
            or(
              ilike(users.fullName, `%${search}%`),
              ilike(users.email, `%${search}%`),
              ilike(users.phone, `%${search}%`),
            ),
          )
        }

        return and(...filters)
      }

      const [field, direction] = sort.split(':')
      const sortOrder = direction === 'asc' ? asc : desc

      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(users)
        .where(where(users, { eq, ilike, and, or }))

      // Pagination data
      const total = totalCount
      const totalPages = Math.ceil(totalCount / perPage)
      const prevPage = page === 1 ? null : page - 1
      const nextPage = page === totalPages ? null : page + 1

      const data = await db
        .select({
          id: users.id,
          name: users.fullName,
          email: users.email,
          phone: users.phone,
          joinedAt: users.createdAt,
          totalSpent: sql<number>`COALESCE(SUM(${orders.total}), 0)`.as(
            'total_spent',
          ),
          orderCount: sql<number>`COUNT(${orders.id})`.as('order_count'),
        })
        .from(users)
        .leftJoin(orders, eq(orders.customerId, users.id))
        .where(where(users, { eq, ilike, and, or }))
        .groupBy(users.id)
        .orderBy(
          field === 'total'
            ? sortOrder(sql`total_spent`)
            : field === 'orders'
              ? sortOrder(sql`order_count`)
              : sortOrder(users.createdAt),
        )
        .limit(perPage)
        .offset((page - 1) * perPage)

      res.json({
        total,
        totalPages,
        data,
        page,
        perPage,
        prevPage,
        nextPage,
      })
    } catch (err) {
      next(err)
    }
  },
)
