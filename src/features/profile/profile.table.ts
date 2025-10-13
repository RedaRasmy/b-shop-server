import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../db/timestamps'
import { relations } from 'drizzle-orm'
import { cartItems, reviews } from '../../db/schema'

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('customer').notNull(), // customer, admin
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt,
  updatedAt,
})

export default users

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  cart: many(cartItems),
}))
