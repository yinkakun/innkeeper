import type { z } from 'zod';
import { addMinutes, formatISO } from 'date-fns';
import postgres from 'postgres';
import { eq, and, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import type { CreateJournalEntrySchema, OnboardUserSchema, UpdateUserSchema } from '@innkeeper/db';
import { journalEntriesTable, usersTable, sessionsTable, emailVerificationTable, promptsTable, schema } from '@innkeeper/db';
import { TOTP, Secret } from 'otpauth';

export const createDbRepository = ({ db }: { db: PostgresJsDatabase<typeof schema> }) => {
  return {
    // USERS
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

    async updateUser({
      id,
      name,
      isPaused,
      primaryGoal,
      promptFrequency,
      promptPeriod,
      promptTone,
      timezone,
    }: z.infer<typeof UpdateUserSchema>) {
      const [updatedUser] = await db
        .update(usersTable)
        .set({ name, isPaused, primaryGoal, promptFrequency, promptPeriod, promptTone, timezone })
        .where(eq(usersTable.id, id))
        .returning();
      return updatedUser;
    },

    async onboardUser({ name, promptFrequency, timezone, primaryGoal, promptPeriod, promptTone, id }: z.infer<typeof OnboardUserSchema>) {
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          name,
          timezone,
          primaryGoal,
          promptTone,
          promptPeriod,
          promptFrequency,
          completedOnboarding: true,
        })
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

    async getUsersWithEmailNotificationsEnabled() {
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.isPaused, false), eq(usersTable.emailNotificationsEnabled, true)),
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

    async getInactiveUsers({ days }: { days: number }) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.isPaused, false), lt(usersTable.lastEntryTime, start.toISOString())),
      });
    },

    // AUTH

    async generateEmailOtpCode({ userId, email }: { userId: string; email: string }) {
      const expiresAt = addMinutes(new Date(), 15);
      const secret = new Secret({ size: 20 }).base32;
      const otp = new TOTP({
        secret: secret,
        digits: 6,
        period: 15 * 60, // 15 minutes
      }).generate();

      await db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));
      await db.insert(emailVerificationTable).values({
        code: otp,
        email,
        userId,
        secret: secret,
        expiresAt: formatISO(expiresAt),
      });
      return otp;
    },

    async verifyEmailOtpCode({ userId, code }: { userId: string; code: string }) {
      return db.transaction(async (tx) => {
        const verificationEntry = await tx.query.emailVerificationTable.findFirst({
          where: and(eq(emailVerificationTable.userId, userId)),
        });

        if (!verificationEntry) {
          return {
            isValid: false,
            reason: 'User not found',
          };
        }

        const { secret, expiresAt } = verificationEntry;

        if (new Date() > new Date(expiresAt)) {
          return { isValid: false, reason: 'Code expired' };
        }

        const totp = new TOTP({ secret: secret, period: 15 * 60 });
        const isValid = totp.validate({ token: code, window: 1 });

        if (isValid === null) {
          return {
            isValid: false,
            reason: 'Invalid code',
          };
        }

        await tx.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));
        return { isValid: true };
      });
    },

    // PROMPTS
    async createPrompt({ prompt, userId }: { prompt: string; userId: string }) {
      const [newPrompt] = await db
        .insert(promptsTable)
        .values({
          prompt,
          userId,
        })
        .returning();
      return newPrompt;
    },

    async getPromptsByUserId({ userId }: { userId: string }) {
      return db.query.promptsTable.findMany({
        where: eq(promptsTable.userId, userId),
        with: {
          journalEntries: true,
        },
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });
    },

    async deletePrompt({ id, userId }: { id: string; userId: string }) {
      const [deletedPrompt] = await db
        .delete(promptsTable)
        .where(and(eq(promptsTable.id, id), eq(promptsTable.userId, userId)))
        .returning();
      return deletedPrompt;
    },

    async updatePrompt({ id, prompt, userId }: { id: string; prompt: string; userId: string }) {
      const [updatedPrompt] = await db
        .update(promptsTable)
        .set({ prompt })
        .where(and(eq(promptsTable.id, id), eq(promptsTable.userId, userId)))
        .returning();
      return updatedPrompt;
    },

    async getPromptById({ id, userId }: { id: string; userId: string }) {
      return db.query.promptsTable.findFirst({
        where: and(eq(promptsTable.id, id), eq(promptsTable.userId, userId)),
      });
    },

    // JOURNAL ENTRIES
    async createJournalEntry({ entry, userId, promptId }: z.infer<typeof CreateJournalEntrySchema>) {
      const [newJournalEntry] = await db.insert(journalEntriesTable).values({ entry, userId, promptId }).returning();
      return newJournalEntry;
    },

    async updateJournalEntry({ entry, id, userId }: { entry: string; id: string; userId: string }) {
      const [updatedJournalEntry] = await db
        .update(journalEntriesTable)
        .set({ entry })
        .where(and(eq(journalEntriesTable.id, id), eq(journalEntriesTable.userId, userId)))
        .returning();
      return updatedJournalEntry;
    },

    async deleteJournalEntry({ id, userId }: { id: string; userId: string }) {
      const [deletedJournalEntry] = await db
        .delete(journalEntriesTable)
        .where(and(eq(journalEntriesTable.id, id), eq(journalEntriesTable.userId, userId)))
        .returning();
      return deletedJournalEntry;
    },
  };
};

export type DbRepository = ReturnType<typeof createDbRepository>;

export const initDbRepository = (databaseUrl?: string) => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  // supabase: disable prefetch as it is not supported for "transaction" pool mode
  // https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
  const connection = postgres(databaseUrl, { prepare: false });
  return createDbRepository({ db: drizzle(connection, { schema }) });
};

export const initLuciaDbAdapter = (databaseUrl?: string) => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  // supabase: disable prefetch as it is not supported for "transaction" pool mode
  // https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
  const connection = postgres(databaseUrl, { prepare: false });
  return new DrizzlePostgreSQLAdapter(drizzle(connection, { schema }), sessionsTable, usersTable);
};
