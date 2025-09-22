import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { users } from '../db/schemas'
import {
  comparePassword,
  generateAccessToken,
  generateTokens,
  hashPassword,
  revokeRefreshToken,
  verifyRefreshToken,
} from '../utils/auth'

export type EmailPassword = {
  email: string
  password: string
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15min,
      sameSite: 'none',
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days,
      sameSite: 'none',
      path: '/api/auth/refresh',
    })

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
      },
      message: 'User registered and logged in successfully',
    })
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      res.status(400).json({ message: 'Email already in use' })
    } else {
      next(err)
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  try {
    // verify email & password
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect' })
    }

    // verify password
    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Email or password is incorrect' })
    }
    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      email,
      user.role,
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15min,
      sameSite: 'none',
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days,
      sameSite: 'none',
      path: '/api/auth/refresh',
    })

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      message: 'User logged in successfully',
    })
  } catch (err) {
    next(err)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies.refreshToken

  try {
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Unauthorized , please log in',
      })
    }
    const session = await verifyRefreshToken(refreshToken)

    if (!session)
      return res.status(401).json({
        message: 'Unauthorized , please log in',
      })

    const user = session.user
    const accessToken = generateAccessToken(user.id, user.email, user.role)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15min,
      sameSite: 'none',
    })

    res.status(200).json({
      message: 'Access token regenerated successfully',
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
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
}

function isUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  // Direct Postgres/Neon error
  if ("code" in error && (error as any).code === "23505") return true;

  // Wrapped inside drizzle cause
  if ("cause" in error && (error as any).cause?.code === "23505") return true;

  return false;
}