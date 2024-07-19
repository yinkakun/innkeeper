import { createDb } from '@innkeeper/db';


const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const db = createDb(DATABASE_URL);


