import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const DB_URL = 'postgresql://postgres:147258369Syk!@db.egnhnzlipwqpxtmzqrjk.supabase.co:5432/postgres';

export * from 'drizzle-orm';

import * as auth from './schema/auth';

export const schema = { ...auth };

export const db = drizzle(postgres(DB_URL), { schema });
