import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/auth'

export const optionalAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken

    try {
      if (token) {
        const decoded = verifyAccessToken(token)
        req.user = decoded
      }

      next()

    } catch (error) {
      res.status(401).json({ message: 'Invalid token' })
    }
  }
}
