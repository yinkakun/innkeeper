import { z } from 'zod';
import { relations, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, pgTable, text, timestamp, uniqueIndex, index, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users',
  {
    name: text('name'),
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    promptHourUTC: integer('promptHourUTC'), // 0-23
    timezone: text('timezone'), // TODO: maybe use enum?
    lastEntryTime: timestamp('lastEntryTime', {
      mode: 'string',
    }),
    createdAt: timestamp('created_at', {
      mode: 'string',
      withTimezone: true,
    })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updated_at', {
      mode: 'string',
      withTimezone: true,
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

export const sessionsTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
});

export const emailVerificationTable = pgTable('email_verification', {
  id: text('id').primaryKey().$default(createId),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  email: text('email').notNull(),
  code: text('code').notNull(),
  secret: text('secret').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
  })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: timestamp('expires_at', {
    mode: 'string',
    withTimezone: true,
  }).notNull(),
});

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
      withTimezone: true,
    })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
      withTimezone: true,
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
      withTimezone: true,
    })
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: timestamp('updatedAt', {
      mode: 'string',
      withTimezone: true,
    }).$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`),
    isDeleted: boolean('isDeleted').notNull().default(false),
  },
  (table) => ({
    journalEntryUserIdIndex: index('journalEntriesUserIdIndex').on(table.userId, table.isDeleted),
    journalEntryPromptIdIndex: index('journalEntryPromptIdIndex').on(table.promptId, table.isDeleted),
  }),
);

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

export const UserSchema = createSelectSchema(usersTable);
export const PromptSchema = createSelectSchema(promptsTable);
export const JournalEntrySchema = createSelectSchema(journalEntriesTable);

export const UpdateUserSchema = createInsertSchema(usersTable, {
  email: z.string().email().min(1).max(255),
})
  .omit({ createdAt: true, updatedAt: true, lastEntryTime: true })
  .required({ id: true });

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
