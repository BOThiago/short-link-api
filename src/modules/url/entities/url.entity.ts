import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  index,
} from 'drizzle-orm/mysql-core';

export const urls = mysqlTable(
  'urls',
  {
    id: int('id').primaryKey().autoincrement(),
    shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
    originalUrl: varchar('original_url', { length: 2000 }).notNull(),
    accessCount: int('access_count').default(0).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    creatorIp: varchar('creator_ip', { length: 45 }),
  },
  (table) => ({
    shortCodeIdx: index('short_code_idx').on(table.shortCode),
    expiresAtIdx: index('expires_at_idx').on(table.expiresAt),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  }),
);

export type Url = typeof urls.$inferSelect;
export type InsertUrl = typeof urls.$inferInsert;
