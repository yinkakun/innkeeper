import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: '../../supabase/migrations',
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;
