import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import { urls } from '../../modules/url/entities/url.entity';
import { urlAccesses } from '../../modules/url/entities/url-access.entity';

export const schema = {
  urls,
  urlAccesses,
};

export const createDatabase = (config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}) => {
  const pool = createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectionLimit: 10,
  });

  return drizzle(pool, { schema, mode: 'default' });
};

export type Database = ReturnType<typeof createDatabase>;
