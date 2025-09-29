import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const idParamSchema = z.string().uuid()

export function validateIdParam(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    idParamSchema.parse(req.params.id)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Invalid ID parameter',
        details: error.issues,
      })
    } else {
      next(error)
    }
  }
}

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid body',
          details: error.issues,
        })
      } else {
        next(error)
      }
    }
  }
}

// export const validateQuery = (schema: z.ZodSchema) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       (req as any).validatedQuery = schema.parse(req.query)
//       next()
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         res.status(400).json({
//           message: 'Invalid query params',
//           details: error.issues,
//         })
//       } else {
//         next(error)
//       }
//     }
//   }
// }

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid query params',
          details: error.issues,
        })
      } else {
        next(error)
      }
    }
  }
}
