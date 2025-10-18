import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../../db/timestamps'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { cartItems, reviews } from '../../db/schema'

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 100 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('customer').notNull(),
  phone: varchar({ length: 16 }),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt,
  updatedAt,
})

export default users

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  cart: many(cartItems),
}))

export type SUser = InferSelectModel<typeof users>
export type IUser = InferInsertModel<typeof users>
