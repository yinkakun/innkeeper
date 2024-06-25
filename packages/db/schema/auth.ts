import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const auth = pgTable('users', {
  name: text('name'),
  id: serial('id').primaryKey(),
  email: text('email').unique(),
});
