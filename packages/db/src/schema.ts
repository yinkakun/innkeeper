import { z } from 'zod';
import { relations, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, pgTable, text, timestamp, uniqueIndex, index, boolean } from 'drizzle-orm/pg-core';

// Tables

export const usersTable = pgTable(
  'users',
  {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    promptHourUTC: integer('promptHourUTC').notNull(), // 0-23
    timezone: text('timezone').notNull(), // TODO: maybe use enum?
    lastEntryTime: timestamp('lastEntryTime', {
      mode: 'string',
    }),
    createdAt: timestamp('createdAt')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
    }).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
    isPaused: boolean('isPaused').default(false),
    completedOnboarding: boolean('completedOnboarding').notNull().default(false),
  },
  (table) => ({
    emailIndex: uniqueIndex('emailIndex').on(table.email),
    preferredHourIndex: index('preferredHourIndex').on(table.promptHourUTC, table.isPaused),
    lastEntryTimeIndex: index('lastEntryTimeIndex').on(table.lastEntryTime, table.isPaused),
  }),
);

export const promptsTable = pgTable(
  'prompts',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    id: text('id').notNull().primaryKey().$default(createId),
    body: text('body').notNull(),
    title: text('title').notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'string',
    })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
    }).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    promptUserIdIndex: index('promptUserIdIndex').on(table.userId),
  }),
);

export const journalEntriesTable = pgTable(
  'journal_entries',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    promptId: text('promptId')
      .notNull()
      .references(() => promptsTable.id, { onDelete: 'cascade' }),
    entry: text('entry').notNull(),
    id: text('id').notNull().primaryKey().$default(createId),
    createdAt: timestamp('createdAt', {
      mode: 'string',
    })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
    }).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
    isDeleted: boolean('isDeleted').notNull().default(false),
  },
  (table) => ({
    journalEntryUserIdIndex: index('journalEntriesUserIdIndex').on(table.userId, table.isDeleted),
    journalEntryPromptIdIndex: index('journalEntryPromptIdIndex').on(table.promptId, table.isDeleted),
  }),
);

// Relations

export const userRelations = relations(usersTable, ({ many }) => ({
  prompts: many(promptsTable),
  journalEntries: many(journalEntriesTable),
}));

export const promptRelations = relations(promptsTable, ({ one }) => ({
  user: one(usersTable, { fields: [promptsTable.userId], references: [usersTable.id] }),
  journalEntries: one(journalEntriesTable, { fields: [promptsTable.id], references: [journalEntriesTable.promptId] }),
}));

export const journalEntryRelations = relations(journalEntriesTable, ({ one }) => ({
  user: one(usersTable, { fields: [journalEntriesTable.userId], references: [usersTable.id] }),
  prompt: one(promptsTable, { fields: [journalEntriesTable.promptId], references: [promptsTable.id] }),
}));

// Schemas

export const UserSchema = createSelectSchema(usersTable);
export const PromptSchema = createSelectSchema(promptsTable);
export const JournalEntrySchema = createSelectSchema(journalEntriesTable);

export const CreateUserSchema = createInsertSchema(usersTable, {
  email: z.string().email().min(1).max(255),
  promptHourUTC: z.number().int().min(0).max(23),
}).omit({
  lastEntryTime: true,
});

export const UpdateUserSchema = CreateUserSchema.omit({ createdAt: true, updatedAt: true }).required({ id: true });

export const CreatePromptSchema = createInsertSchema(promptsTable, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateJournalEntrySchema = createInsertSchema(journalEntriesTable, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});
