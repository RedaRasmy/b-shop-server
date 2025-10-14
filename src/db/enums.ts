import { pgEnum } from 'drizzle-orm/pg-core'
import z from 'zod'

export const entityStatus = pgEnum('entity_status', ['active', 'inactive'])

export const StatusSchema = z.enum(['active', 'inactive'])
