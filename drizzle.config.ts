import type { Config } from 'drizzle-kit';

export default {
  schema: './src/shared/database/entities/*.entity.ts',
  out: './database',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'shortlink',
  },
  verbose: true,
  strict: true,
} satisfies Config; 