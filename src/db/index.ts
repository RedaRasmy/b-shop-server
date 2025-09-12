import { drizzle } from 'drizzle-orm/neon-http'
import config from '../config/config'
import * as schema from './schemas'

export const db = drizzle(config.DATABASE_URL, { schema })
