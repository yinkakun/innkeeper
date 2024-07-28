import { z } from 'zod';
import { relations, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { pgTable, text, timestamp, uniqueIndex, index, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const promptFrequencyEnum = pgEnum('prompt_frequency', ['daily', 'weekly']);
export const promptToneEnum = pgEnum('prompt_tone', ['neutral', 'nurturing', 'challenging']);
export const promptPeriodEnum = pgEnum('prompt_period', ['morning', 'afternoon', 'evening', 'night']);
export const primaryJournalGoalEnum = pgEnum('primary_journal_goal', [
  'Self-Discovery and Growth',
  'Emotional Wellness and Resilience',
  'Relationships and Behavioral Change',
]);

export const usersTable = pgTable(
  'users',
  {
    name: text('name'),
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    timezone: text('userTimezone'),
    promptPeriod: promptPeriodEnum('prompt_period'),
    lastEntryTime: timestamp('lastEntryTime', {
      mode: 'string',
    }),
    promptTone: promptToneEnum('prompt_tone'),
    primaryGoal: primaryJournalGoalEnum('primary_journal_goal'),
    promptFrequency: promptFrequencyEnum('prompt_frequency'),
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

export const journalEntriesTable = pgTable(
  'journal_entries',
  {
    userId: text('userId')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    entry: text('entry'),
    prompt: text('prompt'),
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
  }),
);

export const userRelations = relations(usersTable, ({ many }) => ({
  journalEntries: many(journalEntriesTable),
}));

export const journalEntryRelations = relations(journalEntriesTable, ({ one }) => ({
  user: one(usersTable, { fields: [journalEntriesTable.userId], references: [usersTable.id] }),
}));

export const UserSchema = createSelectSchema(usersTable);
export const JournalEntrySchema = createSelectSchema(journalEntriesTable);

export const UpdateUserSchema = createInsertSchema(usersTable, {})
  .omit({ createdAt: true, updatedAt: true, lastEntryTime: true, email: true, completedOnboarding: true })
  .partial()
  .required({ id: true });

export const CreateJournalEntrySchema = createInsertSchema(journalEntriesTable, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

export const UpdateJournalEntrySchema = createInsertSchema(journalEntriesTable, {}).omit({
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

export const OnboardUserSchema = createInsertSchema(usersTable, {}).omit({
  email: true,
  isPaused: true,
  createdAt: true,
  updatedAt: true,
  completedOnboarding: true,
});
