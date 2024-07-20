import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({});

if (!process.env.DB_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  dialect: 'postgresql',
  schema: './src/schema.ts',
  dbCredentials: { url: process.env.DB_URL },
} satisfies Config;
