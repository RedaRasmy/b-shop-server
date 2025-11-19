import { PasswordSchema } from '../auth/auth.validation'
import { db } from '../../db/index'
import { users } from '../../db/schema'
import { FullNameSchema, PhoneSchema } from './profile.validation'
import { comparePassword, hashPassword } from '../../utils/auth'
import { makeAuthEndpoint, makeBodyEndpoint } from '../../utils/wrappers'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const me = makeAuthEndpoint(async (req, res, next) => {
  const userId = req.user.id

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        isEmailVerified: true,
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        phone: true,
        role: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

export const updateProfile = makeBodyEndpoint(
  z.object({
    phone: PhoneSchema.optional(),
    fullName: FullNameSchema.optional(),
  }),
  async (req, res, next) => {
    const { phone, fullName } = req.body
    const userId = req.user?.id!

    const updateData: Partial<typeof users.$inferInsert> = {}

    if (phone !== undefined) updateData.phone = phone
    if (fullName !== undefined) updateData.fullName = fullName

    try {
      await db.update(users).set(updateData).where(eq(users.id, userId))

      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  },
)

export const updatePassword = makeBodyEndpoint(
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
