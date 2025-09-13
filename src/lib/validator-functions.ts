import type { NextFunction , Request , Response } from "express";
import { z } from 'zod';

const idParamSchema = z.string().uuid()

export function validateIdParam() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      idParamSchema.parse(req.params.id);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Invalid ID parameter',
          details: error.issues
        });
      } else {
        next(error);
      }
    }
  };
}

// export function validateQueryParam() {
  
// }


export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues
        });
      } else {
        next(error);
      }
    }
  };
};