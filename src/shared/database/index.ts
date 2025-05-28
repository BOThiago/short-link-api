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
  console.log('🔗 Connecting to database:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
  });

  const poolConfig: any = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    idleTimeout: 300000,
  };

  if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }

  const pool = createPool(poolConfig);

  pool
    .getConnection()
    .then((connection) => {
      console.log('✅ Database connected successfully');
      connection.release();
    })
    .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
      console.error('Connection config:', {
        host: config.host,
        port: config.port,
        user: config.user,
        database: config.database,
      });
    });

  return drizzle(pool, { schema, mode: 'default' });
};

export type Database = ReturnType<typeof createDatabase>;
