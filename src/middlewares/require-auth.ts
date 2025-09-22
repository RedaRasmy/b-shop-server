import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: { userId: string; role: string; email: string };
}

export const requireAuth = (requiredRole?: 'admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.accessToken
    
    if (!token) {
      return res.status(401).json({ message: 'Login required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
        role: 'customer' | 'admin';
        email: string;
      };
      
      req.user = decoded;

      // Check role if specified
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: `${requiredRole} access required` });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};