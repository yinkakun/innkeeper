import { initDbService } from '@innkeeper/service';
export const db = initDbService(process.env.DATABASE_URL);
