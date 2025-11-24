import { pgTable, serial, varchar, timestamp, index, uuid } from 'drizzle-orm/pg-core'
import { users } from '../../../db/schema'
import { createdAt } from '../../../db/timestamps'
import { relations } from 'drizzle-orm'


const resetTokens = pgTable(
  'reset_tokens',
  {
    id: serial('id').primaryKey(),
    token: varchar('token', { length: 128 }).notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt,
  },
  (table) => ({
    tokenIdx: index('idx_reset_token').on(table.token),
  }),
)


export default resetTokens


export const resetTokensRelations = relations(resetTokens,({one})=>({
    user: one(users,{
        fields : [resetTokens.userId],
        references : [users.id]
    })
}))