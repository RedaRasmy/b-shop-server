import type { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { users } from '../db/schemas'
import { generateTokens, hashPassword } from '../utils/auth'

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
      res.status(400).json({ error: 'Email already in use' })
    } else {
      next(err)
    }
  }
}

export function login() {}

export function refresh() {}

export function logout() {}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as any).code === '23505'
  )
}
