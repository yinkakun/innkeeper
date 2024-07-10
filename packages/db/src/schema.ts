import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Tables

export const usersTable = pgTable(
  'users',
  {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    isPaused: boolean('isPaused').notNull().default(false),
    preferredHourUTC: integer('preferredHourUTC').notNull(), // 0-23
    timezone: text('timezone').notNull(), // TODO: use enum
    lastResponseAt: timestamp('lastResponseAt', {
      mode: 'string',
      withTimezone: false,
    }),
    createdAt: timestamp('createdAt', {
      mode: 'string',
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
      withTimezone: false,
    }).$onUpdateFn(() => sql`now()`),
  },
  (table) => ({
    emailIndex: uniqueIndex('emailIndex').on(table.email),
    preferredHourIndex: index('preferredHourIndex').on(table.preferredHourUTC, table.isPaused),
    lastResponseAtIndex: index('lastResponseAtIndex').on(table.lastResponseAt, table.isPaused),
  }),
);

export const promptsTable = pgTable(
  'prompts',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    id: text('id').notNull().primaryKey().$default(createId),
    prompt: text('prompt').notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'string',
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
      withTimezone: false,
    }).$onUpdateFn(() => sql`now()`),
  },
  (table) => ({
    promptUserIdIndex: index('promptUserIdIndex').on(table.userId),
  }),
);

export const responseTable = pgTable(
  'responses',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    promptId: text('promptId')
      .notNull()
      .references(() => promptsTable.id, { onDelete: 'cascade' }),
    response: text('response').notNull(),
    id: text('id').notNull().primaryKey().$default(createId),
    createdAt: timestamp('createdAt', {
      mode: 'string',
      withTimezone: false,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: false,
    }).$onUpdateFn(() => sql`now()`),
    isDeleted: boolean('isDeleted').notNull().default(false),
  },
  (table) => ({
    responseUserIdIndex: index('responseUserIdIndex').on(table.userId, table.isDeleted),
    responsePromptIdIndex: index('responsePromptIdIndex').on(table.promptId, table.isDeleted),
  }),
);

// Relations

export const userRelations = relations(usersTable, ({ many }) => ({
  prompts: many(promptsTable),
  responses: many(responseTable),
}));

export const promptRelations = relations(promptsTable, ({ one }) => ({
  user: one(usersTable, { fields: [promptsTable.userId], references: [usersTable.id] }),
  response: one(responseTable, { fields: [promptsTable.id], references: [responseTable.promptId] }),
}));

export const responseRelations = relations(responseTable, ({ one }) => ({
  user: one(usersTable, { fields: [responseTable.userId], references: [usersTable.id] }),
  prompt: one(promptsTable, { fields: [responseTable.promptId], references: [promptsTable.id] }),
}));

// Schemas

export const UserSchema = createSelectSchema(usersTable);
export const PromptSchema = createSelectSchema(promptsTable);
export const ResponseSchema = createSelectSchema(responseTable);

export const CreateUsersSchema = createInsertSchema(usersTable, {
  email: z.string().email().min(1).max(255),
  preferredHourUTC: z.number().int().min(0).max(23),
}).omit({
  lastResponseAt: true,
});

export const UpdateUserSchema = CreateUsersSchema.omit({ createdAt: true, updatedAt: true }).required({ id: true });

export const CreatePromptsSchema = createInsertSchema(promptsTable, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateResponseSchema = createInsertSchema(responseTable, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});
