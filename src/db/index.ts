import { drizzle } from 'drizzle-orm/neon-http'
import config from '../config/config'
import * as schema from './schema'

export const db = drizzle(config.DATABASE_URL, { schema })