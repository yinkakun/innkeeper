import type { z } from 'zod';
import { between, eq, and } from 'drizzle-orm';
import type { dbClient as dbClient } from 'db/client';
import { promptsTable, responseTable, usersTable } from 'db/schema';
import type { CreateResponseSchema, CreatePromptsSchema, UpdateUserSchema, CreateUsersSchema } from 'db/schema';

export const createDbService = ({ db }: { db: typeof dbClient }) => {
  return {
    async createUser({ id, name, email, preferredHourUTC, timezone }: z.infer<typeof CreateUsersSchema>) {
      const [newUser] = await db.insert(usersTable).values({ id, name, email, preferredHourUTC, timezone }).returning();
      return newUser;
    },

    async pauseUser({ userId }: { userId: string }) {
      const [pausedUser] = await db.update(usersTable).set({ isPaused: true }).where(eq(usersTable.id, userId)).returning();
      return pausedUser;
    },

    async deleteUser({ userId }: { userId: string }) {
      const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
      return deletedUser;
    },

    async updateUser({ id, name, email, preferredHourUTC, timezone }: z.infer<typeof UpdateUserSchema>) {
      const [updatedUser] = await db
        .update(usersTable)
        .set({ name, email, preferredHourUTC, timezone })
        .where(eq(usersTable.id, id))
        .returning();
      return updatedUser;
    },

    async createPrompt({ prompt, userId }: z.infer<typeof CreatePromptsSchema>) {
      const [newPrompt] = await db.insert(promptsTable).values({ prompt, userId }).returning();
      return newPrompt;
    },

    async createResponse({ response, promptId, userId }: z.infer<typeof CreateResponseSchema>) {
      return db.transaction(async (tx) => {
        await tx.insert(responseTable).values({ response, promptId, userId }).returning();
        await tx.update(usersTable).set({ lastResponseAt: new Date().toISOString() }).where(eq(usersTable.id, userId));
        return tx.query.responseTable.findFirst({
          columns: {
            isDeleted: false,
          },
          where: eq(responseTable.promptId, promptId),
        });
      });
    },

    async updateResponse(id: string, { response }: { response: string }) {
      const [updatedResponse] = await db.update(responseTable).set({ response }).where(eq(responseTable.id, id)).returning();
      return updatedResponse;
    },

    async deleteResponse(id: string) {
      const [deletedUser] = await db.update(responseTable).set({ isDeleted: true }).where(eq(responseTable.id, id)).returning();
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

    async getUsersToPromptByHourUTC({ hourUtc }: { hourUtc: number }) {
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.preferredHourUTC, hourUtc), eq(usersTable.isPaused, false)),
      });
    },

    async getUsersByLastResponseAt({ days }: { days: number }) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      return db.query.usersTable.findMany({
        where: and(between(usersTable.lastResponseAt, start.toISOString(), now.toISOString()), eq(usersTable.isPaused, false)),
      });
    },

    async getJournalEntriesByUserId({ userId, isDeleted = false }: { userId: string; isDeleted?: boolean }) {
      return db.query.responseTable.findMany({
        where: (response, { and, eq }) => and(eq(response.userId, userId), eq(response.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
        columns: {
          isDeleted: false,
        },
        orderBy: (response, { desc }) => desc(response.createdAt),
      });
    },

    async getJournalEntryByPromptId({ promptId, isDeleted = false }: { promptId: string; isDeleted?: boolean }) {
      return db.query.responseTable.findFirst({
        where: (response, { and, eq }) => and(eq(response.promptId, promptId), eq(response.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
        columns: {
          isDeleted: false,
        },
      });
    },

    async getJournalEntryByResponseId({ responseId, isDeleted = false }: { responseId: string; isDeleted?: boolean }) {
      return db.query.responseTable.findFirst({
        where: (response, { and, eq }) => and(eq(response.id, responseId), eq(response.isDeleted, isDeleted)),
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
