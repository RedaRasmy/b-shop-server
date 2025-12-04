import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { db } from '../db'
import { refreshTokens } from '../db/schema'
import { eq } from 'drizzle-orm'
import config from '../config/config'

export type AccessTokenPayload = {
  id: string
  role: string
  email: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

// Generate Access Token (short-lived)
export const generateAccessToken = (
  id: string,
  email: string,
  role: string,
): string => {
  return jwt.sign(
    {
      id,
      role,
      email,
    },
    config.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }, // 15 minutes
  )
}

// Generate Refresh Token (long-lived)
const generateRefreshToken = async (userId: string) => {
  // Generate random string
  const token = crypto.randomBytes(64).toString('hex')

  // Store in database
  await db.insert(refreshTokens).values({
    token,
    userId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  })

  return token
}

// Generate both tokens at once
export const generateTokens = async (
  id: string,
  email: string,
  role: string,
) => {
  return {
    accessToken: generateAccessToken(id, email, role),
    refreshToken: await generateRefreshToken(id),
  }
}

// Verify Access Token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload
}

// Verify Refresh Token
export const verifyRefreshToken = async (token: string) => {
  const refreshToken = await db.query.refreshTokens.findFirst({
    where: (refreshTokens, { and, eq, gt }) =>
      and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date()), // Not expired
      ),
    with: {
      user: true,
    },
  })

  return refreshToken
}

export const revokeRefreshToken = async (token: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
}
