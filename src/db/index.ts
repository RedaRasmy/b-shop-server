import { drizzle } from 'drizzle-orm/neon-http';
import config from '../config/config';

export const db = drizzle(config.DATABASE_URL);
