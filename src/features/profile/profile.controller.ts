import { PasswordSchema } from '@auth/auth.validation'
import { db } from '@db/index'
import { users } from '@db/schema'
import { comparePassword, hashPassword } from '@utils/auth'
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

export const updatePassword = makePostEndpoint(
  z.object({
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema,
  }),
  async (req, res, next) => {
    const userId = req.user?.id!
    const { oldPassword, newPassword } = req.body
    try {
      // validate old password

      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      })

      if (!user) {
        return res.status(401).json({ message: 'Password is incorrect' })
      }

      const isPasswordCorrect = await comparePassword(
        oldPassword,
        user.password,
      )

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Password is incorrect' })
      }

      // update password

      const hashedPassword = await hashPassword(newPassword)

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, userId))

      res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  },
)
