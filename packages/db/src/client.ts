import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const DB_URL = 'xxx';
export * from 'drizzle-orm';

import * as schema from './schema';

export const db = drizzle(postgres(DB_URL), { schema });
