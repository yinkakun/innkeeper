import 'dotenv/config';
import postgres from 'postgres';
import { schema } from '@innkeeper/db';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const connection = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(connection, { schema });

console.log('Migrating database');

await migrate(db, { migrationsFolder: '../../db/migrations' });

console.log('Migrations complete');

await connection.end();
