import type { Response, Request, NextFunction } from 'express'


export function notFound(req: Request, res: Response, next: NextFunction) {
  return next({
    message : 'Route not found',
    status : 404
  })
}
