import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
const IdSchema = z.string().min(1)

export interface ValidatedQueryRequest<T> extends Request<any, any, any, T> {
  validatedQuery: T
}

export function makeGetEndpoint<Query>(
  schema: z.ZodType<Query>,
  callback: (
    req: ValidatedQueryRequest<Query>,
    res: Response,
    next: NextFunction,
  ) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      return res.status(400).send({
        message: 'Invalid query params',
        details: result.error.issues,
      })
    }

    // req.validatedQuery = result.data
    ;(req as ValidatedQueryRequest<Query>).validatedQuery = result.data

    return callback(req as ValidatedQueryRequest<Query>, res, next)
  }
}

export function makeByIdEndpoint(
  callback: (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = IdSchema.safeParse(req.params.id)

    if (!result.success) {
      return res.status(400).send({
        message: 'Invalid search params',
        details: result.error.issues,
      })
    }
    return callback(req as any, res, next)
  }
}

export function makePostEndpoint<Body>(
  schema: z.ZodType<Body>,
  callback: (
    req: Request<any, any, Body>,
    res: Response,
    next: NextFunction,
  ) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).send({
        message: 'Invalid body',
        details: result.error.issues,
      })
    }

    req.body = result.data

    return callback(req as any, res, next)
  }
}

export function makeUpdateEndpoint<Body>(
  schema: z.ZodType<Body>,
  callback: (
    req: Request<{ id: string }, any, Body>,
    res: Response,
    next: NextFunction,
  ) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const IdSchema = z.string().min(1)
    const result = IdSchema.safeParse(req.params.id)

    if (!result.success) {
      return res.status(400).send({
        message: 'Invalid search params',
        details: result.error.issues,
      })
    }

    const bodyResult = schema.safeParse(req.body)

    if (!bodyResult.success) {
      return res.status(400).send({
        message: 'Invalid body',
        details: bodyResult.error.issues,
      })
    }

    return callback(req as any, res, next)
  }
}

export function makeSimpleEndpoint(
  callback: (req: Request, res: Response, next: NextFunction) => void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    return callback(req as any, res, next)
  }
}
