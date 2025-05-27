import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  index,
} from 'drizzle-orm/mysql-core';
import { urls } from './url.entity';

export const urlAccesses = mysqlTable(
  'url_accesses',
  {
    id: int('id').primaryKey().autoincrement(),
    urlId: int('url_id')
      .notNull()
      .references(() => urls.id, { onDelete: 'cascade' }),
    accessedAt: timestamp('accessed_at').defaultNow().notNull(),
    userAgent: varchar('user_agent', { length: 500 }),
    ipAddress: varchar('ip_address', { length: 45 }),
    referer: varchar('referer', { length: 1000 }),
  },
  (table) => ({
    urlIdIdx: index('url_id_idx').on(table.urlId),
    accessedAtIdx: index('accessed_at_idx').on(table.accessedAt),
    ipAddressIdx: index('ip_address_idx').on(table.ipAddress),
  }),
);

export type UrlAccess = typeof urlAccesses.$inferSelect;
export type InsertUrlAccess = typeof urlAccesses.$inferInsert;
