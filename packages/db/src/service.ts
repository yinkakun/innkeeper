import type { z } from 'zod';
import { between, eq, and } from 'drizzle-orm';
import type { DbClient } from '@innkeeper/db';
import { promptsTable, journalEntriesTable, usersTable } from '@innkeeper/db';
import type { CreateJournalEntrySchema, CreatePromptSchema, UpdateUserSchema, CreateUserSchema } from '@innkeeper/db';

export const createDbService = ({ db }: { db: DbClient }) => {
  return {
    async createUser({ id, name, email, promptHourUTC, timezone }: z.infer<typeof CreateUserSchema>) {
      const [newUser] = await db.insert(usersTable).values({ id, name, email, promptHourUTC, timezone }).returning();
      return newUser;
    },

    async pauseUser({ userId }: { userId: string }) {
      const [pausedUser] = await db.update(usersTable).set({ isPaused: true }).where(eq(usersTable.id, userId)).returning();
      return pausedUser;
    },

    async unPauseUser({ userId }: { userId: string }) {
      const [unPausedUser] = await db.update(usersTable).set({ isPaused: false }).where(eq(usersTable.id, userId)).returning();
      return unPausedUser;
    },

    async deleteUser({ userId }: { userId: string }) {
      const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
      return deletedUser;
    },

    async updateUser({ id, name, email, promptHourUTC, timezone }: z.infer<typeof UpdateUserSchema>) {
      const [updatedUser] = await db
        .update(usersTable)
        .set({ name, email, promptHourUTC, timezone })
        .where(eq(usersTable.id, id))
        .returning();
      return updatedUser;
    },

    async createPrompt({ title, body, userId }: z.infer<typeof CreatePromptSchema>) {
      const [newPrompt] = await db.insert(promptsTable).values({ title, body, userId }).returning();
      return newPrompt;
    },

    async createJournalEntry({ entry, promptId, userId }: z.infer<typeof CreateJournalEntrySchema>) {
      return db.transaction(async (tx) => {
        await tx.insert(journalEntriesTable).values({ entry, promptId, userId }).returning();
        await tx.update(usersTable).set({ lastEntryTime: new Date().toISOString() }).where(eq(usersTable.id, userId));
        return tx.query.journalEntriesTable.findFirst({
          columns: {
            isDeleted: false,
          },
          where: eq(journalEntriesTable.promptId, promptId),
        });
      });
    },

    async updateJournalEntry(id: string, { entry }: { entry: string }) {
      const [updatedJournalEntry] = await db.update(journalEntriesTable).set({ entry }).where(eq(journalEntriesTable.id, id)).returning();
      return updatedJournalEntry;
    },

    async deleteJournalEntry(id: string) {
      const [deletedUser] = await db.update(journalEntriesTable).set({ isDeleted: true }).where(eq(journalEntriesTable.id, id)).returning();
      return deletedUser;
    },

    async getUserById({ userId }: { userId: string }) {
      return db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
      });
    },

    async getUserByEmail({ email }: { email: string }) {
      return db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });
    },

    async getUserByPromptId({ promptId }: { promptId: string }) {
      return db.query.promptsTable.findFirst({
        columns: {},
        where: (prompt, { eq }) => eq(prompt.id, promptId),
        with: {
          user: true,
        },
      });
    },

    async getUsersToPromptByCurrentHour({ hourUtc }: { hourUtc: number }) {
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.promptHourUTC, hourUtc), eq(usersTable.isPaused, false)),
      });
    },

    async getUsersByLastJournalEntryTime({ days }: { days: number }) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      return db.query.usersTable.findMany({
        where: and(between(usersTable.lastEntryTime, start.toISOString(), now.toISOString()), eq(usersTable.isPaused, false)),
      });
    },

    async getJournalEntriesByUserId({ userId, isDeleted = false }: { userId: string; isDeleted?: boolean }) {
      return db.query.journalEntriesTable.findMany({
        where: (journalEntry, { and, eq }) => and(eq(journalEntry.userId, userId), eq(journalEntry.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
        columns: {
          isDeleted: false,
        },
        orderBy: (journalEntry, { desc }) => desc(journalEntry.createdAt),
      });
    },

    async getJournalEntryByPromptId({ promptId, isDeleted = false }: { promptId: string; isDeleted?: boolean }) {
      return db.query.journalEntriesTable.findFirst({
        where: (journalEntry, { and, eq }) => and(eq(journalEntry.promptId, promptId), eq(journalEntry.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
        columns: {
          isDeleted: false,
        },
      });
    },

    async getJournalEntryById({ journalEntryId, isDeleted = false }: { journalEntryId: string; isDeleted?: boolean }) {
      return db.query.journalEntriesTable.findFirst({
        where: (journalEntry, { and, eq }) => and(eq(journalEntry.id, journalEntryId), eq(journalEntry.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
        columns: {
          isDeleted: false,
        },
      });
    },
  };
};

export type DbService = ReturnType<typeof createDbService>;
