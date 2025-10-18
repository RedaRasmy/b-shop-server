import { db } from '@db/index'
import { users } from '@db/schema'
import { makePostEndpoint, makeSimpleEndpoint } from '@utils/wrappers'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const me = makeSimpleEndpoint(async (req, res, next) => {
  const user = req.user!

  try {
    const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
      columns: {
        isEmailVerified: true,
      },
    })

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      user: {
        ...user,
        isEmailVerified: dbUser.isEmailVerified,
      },
    })
  } catch (err) {
    next(err)
  }
})

export const updateProfile = makePostEndpoint(
  z.object({
    phone: z.string().min(9).max(16),
  }),
  async (req, res, next) => {
    const { phone } = req.body
    const userId = req.user?.id!

    try {
      await db.update(users).set({ phone }).where(eq(users.id, userId))
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  },
)
