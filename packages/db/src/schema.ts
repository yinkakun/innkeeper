import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

export const usersTable = pgTable('users', {
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  isPaused: boolean('isPaused').notNull().default(false),
  preferredHourUTC: integer('preferredHourUTC').notNull(),
  timezone: varchar('timezone', { length: 255 }).notNull(),
  lastResponseAt: timestamp('lastResponseAt', {
    mode: 'date',
    withTimezone: true,
  }),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const promptsTable = pgTable('prompts', {
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  id: uuid('id').notNull().primaryKey().$default(createId),
  prompt: text('prompt').notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const responseTable = pgTable('responses', {
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  promptId: uuid('promptId')
    .notNull()
    .references(() => promptsTable.id, { onDelete: 'cascade' }),
  response: text('response').notNull(),
  id: uuid('id').notNull().primaryKey().$default(createId),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  isDeleted: boolean('isDeleted').notNull().default(false),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  prompts: many(promptsTable),
  responses: many(responseTable),
}));

export const promptRelations = relations(promptsTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [promptsTable.userId], references: [usersTable.id] }),
  response: one(responseTable, { fields: [promptsTable.id], references: [responseTable.promptId] }),
}));

export const responseRelations = relations(responseTable, ({ one }) => ({
  user: one(usersTable, { fields: [responseTable.userId], references: [usersTable.id] }),
  prompt: one(promptsTable, { fields: [responseTable.promptId], references: [promptsTable.id] }),
}));

export const CreateUsersSchema = createInsertSchema(usersTable, {
  name: z.string().max(255).min(1),
  timezone: z.string().max(255).min(1),
  email: z.string().email().min(1).max(255),
  preferredHourUTC: z.number().int().min(0).max(23),
}).omit({
  lastResponseAt: true,
});

export const UpdateUserSchema = CreateUsersSchema.omit({ createdAt: true, updatedAt: true, isDeleted: true }).required({ id: true });

export const CreatePromptsSchema = createInsertSchema(promptsTable, {
  userId: z.string().uuid(),
  prompt: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateResponseSchema = createInsertSchema(responseTable, {
  response: z.string().max(256),
  userId: z.string().uuid(),
  promptId: z.string().uuid(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});
