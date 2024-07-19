import postgres from 'postgres';
import * as schema from './schema';
import { createDbService } from './service';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export * from './schema';
export * from 'drizzle-orm/sql';
export * as dbSchema from './schema';
export { alias } from 'drizzle-orm/pg-core';
export type DbClient = PostgresJsDatabase<typeof schema>;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const createDb = (databaseUrl: string) => {
  const client = postgres(databaseUrl, { prepare: false });
  return createDbService({ db: drizzle(client, { schema }) });
};


