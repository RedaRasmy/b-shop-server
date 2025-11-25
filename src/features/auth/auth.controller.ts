import { db } from '../../db'
import { resetTokens, users } from '../../db/schema'
import {
  comparePassword,
  generateAccessToken,
  generateTokens,
  hashPassword,
  revokeRefreshToken,
  verifyRefreshToken,
} from '../../utils/auth'
import config from '../../config/config'
import {
  makeBodyEndpoint,
  makeSimpleEndpoint,
} from '../../utils/wrappers'
import { EmailPasswordSchema } from '../auth/auth.validation'
import z from 'zod'
import { eq } from 'drizzle-orm'

export const register = makeBodyEndpoint(
  EmailPasswordSchema,
  async (req, res, next) => {
    const { email, password } = req.body

    try {
      const hashedPassword = await hashPassword(password)

      const [user] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
        })
        .returning()

      if (!user) throw new Error('Failed to insert user') // just to satisfy TS

      const { accessToken, refreshToken } = await generateTokens(
        user.id,
        user.email,
        user.role,
      )

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        maxAge: 15 * 60 * 1000, // 15min,
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days,
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
        path: '/api/auth/refresh',
      })

      res.status(201).json({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      })
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        res.status(400).json({ message: 'Email already in use' })
      } else {
        next(err)
      }
    }
  },
)

export const login = makeBodyEndpoint(
  EmailPasswordSchema,
  async (req, res, next) => {
    const { email, password } = req.body

    try {
      // verify email & password
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      })

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Email or password is incorrect' })
      }

      // verify password
      const isPasswordCorrect = await comparePassword(password, user.password)
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ message: 'Email or password is incorrect' })
      }
      const { accessToken, refreshToken } = await generateTokens(
        user.id,
        email,
        user.role,
      )

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        maxAge: 15 * 60 * 1000, // 15min,
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days,
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
        path: '/api/auth/refresh',
      })

      res.status(200).json({
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      })
    } catch (err) {
      next(err)
    }
  },
)

export const refresh = makeSimpleEndpoint(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken

  try {
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token not provided',
      })
    }
    const session = await verifyRefreshToken(refreshToken)

    if (!session)
      return res.status(401).json({
        message: 'Invalid refresh token',
      })

    const user = session.user
    const accessToken = generateAccessToken(user.id, user.email, user.role)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      maxAge: 15 * 60 * 1000, // 15min,
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    })

    res.status(200).json({
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    })
  } catch (err) {
    next(err)
  }
})

export const logout = makeSimpleEndpoint(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken

  try {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken)
    }

    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' })

    res.status(200).json({
      message: 'User logged out successfully',
    })
  } catch (err) {
    next(err)
  }
})

function isUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  // Direct Postgres/Neon error
  if ('code' in error && (error as any).code === '23505') return true

  // Wrapped inside drizzle cause
  if ('cause' in error && (error as any).cause?.code === '23505') return true

  return false
}

export const resetPassword = makeBodyEndpoint(
  z.object({
    token: z.string(),
    password: z.string().min(8),
  }),
  async (req, res, next) => {
    const { token, password } = req.body

    try {
      await db.transaction(async (tx) => {
        const resetToken = await tx.query.resetTokens.findFirst({
          where: (tokens, { eq }) => eq(tokens.token, token),
        })

        if (!resetToken || resetToken.expiresAt <= new Date()) {
          return res.sendStatus(403)
        }

        const newPasswordHash = await hashPassword(password)

        await tx
          .update(users)
          .set({
            password: newPasswordHash,
          })
          .where(eq(users.id, resetToken.userId))

        await tx.delete(resetTokens).where(eq(resetTokens.id, resetToken.id))
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
)
