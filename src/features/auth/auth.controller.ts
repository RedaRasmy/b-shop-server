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
import { makeBodyEndpoint, makeSimpleEndpoint } from '../../utils/wrappers'
import { EmailPasswordSchema } from '../auth/auth.validation'
import { CookieOptions } from 'express'
// import z from 'zod'
// import { eq } from 'drizzle-orm'
// import { mailgun } from '../../lib/mailgun'
// import crypto from 'crypto'

const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 15 * 60 * 1000, // 15min,
  sameSite: 'none',
}

const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30days,
  sameSite: 'none',
  path: '/api/auth/refresh',
}

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

      res.cookie('accessToken', accessToken, accessTokenOptions)
      res.cookie('refreshToken', refreshToken, refreshTokenOptions)

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

      res.cookie('accessToken', accessToken, accessTokenOptions)
      res.cookie('refreshToken', refreshToken, refreshTokenOptions)

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

    res.cookie('accessToken', accessToken, accessTokenOptions)

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

// export const forgotPassword = makeBodyEndpoint(
//   z.object({
//     email: z.email(),
//   }),
//   async (req, res, next) => {
//     const { email } = req.body

//     try {
//       // check user existence
//       const user = await db.query.users.findFirst({
//         where: (users, { eq }) => eq(users.email, email),
//       })
//       if (!user) {
//         return res.sendStatus(404)
//       }

//       // create, hash and store token

//       const resetToken = crypto.randomBytes(32).toString('hex')

//       const hashedToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex')

//       await db.insert(resetTokens).values({
//         token: hashedToken,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
//         userId: user.id,
//       })

//       // send email

//       const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`

//       await mailgun.messages.create(config.MAILGUN_DOMAIN, {
//         from: config.MAILGUN_FROM,
//         to: [email],
//         subject: 'Reset Password',
//         text: `Click here to reset your password: ${resetLink}`,
//       })
//       res.sendStatus(200)
//     } catch (err) {
//       next(err)
//     }
//   },
// )

// export const resetPassword = makeBodyEndpoint(
//   z.object({
//     token: z.string(),
//     password: z.string().min(8),
//   }),
//   async (req, res, next) => {
//     const { token, password } = req.body

//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

//     try {
//       await db.transaction(async (tx) => {
//         const resetToken = await tx.query.resetTokens.findFirst({
//           where: (tokens, { eq }) => eq(tokens.token, hashedToken),
//         })

//         if (!resetToken || resetToken.expiresAt <= new Date()) {
//           return res.sendStatus(403)
//         }

//         const newPasswordHash = await hashPassword(password)

//         await tx
//           .update(users)
//           .set({
//             password: newPasswordHash,
//           })
//           .where(eq(users.id, resetToken.userId))

//         await tx.delete(resetTokens).where(eq(resetTokens.id, resetToken.id))
//       })
//       res.sendStatus(200)
//     } catch (err) {
//       next(err)
//     }
//   },
// )

// // Email verification

// export const sendVerifyEmail = makeBodyEndpoint(
//   z.object({
//     email: z.email(),
//   }),
//   async (req, res, next) => {
//     const { email } = req.body

//     try {
//     } catch (err) {
//       next(err)
//     }
//   },
// )

// export const verifyEmail = makeBodyEndpoint(
//   z.object({
//     token: z.string().min(1),
//   }),
//   async (req, res, next) => {
//     const { token } = req.body

//     try {
//     } catch (err) {
//       next(err)
//     }
//   },
// )
