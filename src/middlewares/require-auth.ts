import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/auth'

export const requireAuth = (requiredRole?: 'admin') => {
  return (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.accessToken

    if (!token) {
      return res.status(401).json({ message: 'Login required' })
    }

    try {
      const decoded = verifyAccessToken(token)

      req.user = decoded

      // Check role if specified
      if (requiredRole && decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: `${requiredRole} access required` })
      }

      next()
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' })
    }
  }
}
