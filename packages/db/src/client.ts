import { drizzle } from 'drizzle-orm/d1';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

import * as schema from './schema';

export const dbClient = drizzle('', {
  schema,
  logger: process.env.NODE_ENV === 'development' ? true : false,
});

export type DbClient = typeof dbClient;
