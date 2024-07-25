import type { z } from 'zod';

import postgres from 'postgres';
import { eq, and, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { generateRandomString, alphabet } from 'oslo/crypto';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import type { CreateJournalEntrySchema, CreatePromptSchema, UpdateUserSchema } from '@innkeeper/db';
import { promptsTable, journalEntriesTable, usersTable, sessionsTable, emailVerificationTable, schema } from '@innkeeper/db';

export const createDbService = ({ db }: { db: PostgresJsDatabase<typeof schema> }) => {
  return {
    async createUser({ id, email }: { id: string; email: string }) {
      const [newUser] = await db.insert(usersTable).values({ id, email }).returning();
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

    async isUserOnboarded({ userId }: { userId: string }) {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
      });
      return user?.completedOnboarding ?? false;
    },

    async generateEmailOtpCode({ userId, email }: { userId: string; email: string }) {
      const code = generateRandomString(6, alphabet('0-9'));
      const expiresAt = createDate(new TimeSpan(15, 'm')); // 15 minutes
      await db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId)).returning();
      await db.insert(emailVerificationTable).values({
        code,
        email,
        userId,
        expiresAt: expiresAt.toISOString(),
      });
      return code;
    },

    async verifyEmailOtpCode({ userId, code }: { userId: string; code: string }) {
      return db.transaction(async (tx) => {
        const emailVerification = await tx.query.emailVerificationTable.findFirst({
          where: and(eq(emailVerificationTable.userId, userId)),
        });

        if (!emailVerification) {
          return {
            isValidCode: false,
            cause: 'User not found',
          };
        }

        if (!isWithinExpirationDate(new Date(emailVerification.expiresAt))) {
          return {
            isValidCode: false,
            cause: 'Code expired',
          };
        }

        // TODO: investigate why  crypto.subtle.timingSafeEqual is not working
        // const isValid = crypto.subtle.timingSafeEqual(Buffer.from(code), Buffer.from(verifiedUserEmail.code));
        const isValid = code === emailVerification.code;
        if (!isValid) {
          return {
            isValidCode: false,
            cause: 'Invalid code',
          };
        }

        if (isValid) {
          await tx.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));
        }

        return { isValidCode: isValid };
      });
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

    async getUsers() {
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.isPaused, false)),
      });
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

    async getInactiveUsers({ days }: { days: number }) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.isPaused, false), lt(usersTable.lastEntryTime, start.toISOString())),
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

export const initDbService = (databaseUrl?: string) => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  // supabase: disable prefetch as it is not supported for "transaction" pool mode
  // https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
  const client = postgres(databaseUrl, { prepare: false });
  return createDbService({ db: drizzle(client, { schema }) });
};

export const initLuciaDbAdapter = (databaseUrl?: string) => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  // supabase: disable prefetch as it is not supported for "transaction" pool mode
  // https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
  const client = postgres(databaseUrl, { prepare: false });
  return new DrizzlePostgreSQLAdapter(drizzle(client, { schema }), sessionsTable, usersTable);
};
