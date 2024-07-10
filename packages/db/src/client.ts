import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

import * as schema from './schema';

// Supabase: Disable prefetch as it is not supported for "Transaction" pool mode
export const db = drizzle(postgres(process.env.DATABASE_URL, { prepare: false }), { schema });
