import type { z } from 'zod';
import { db } from 'db/client';
import { promptsTable, responseTable } from 'db/schema';
import { eq } from 'drizzle-orm';
import type { CreateResponseSchema } from 'db/schema';
import type { CreatePromptsSchema } from 'db/schema';

export const createJournalEntryService = <T extends typeof db>({ db }: { db: T }) => {
  return {
    async createPrompt({ prompt, userId }: z.infer<typeof CreatePromptsSchema>) {
      return db.insert(promptsTable).values({ prompt, userId }).returning();
    },

    async createResponse({ response, promptId, userId }: z.infer<typeof CreateResponseSchema>) {
      return db.insert(responseTable).values({ response, promptId, userId }).returning();
    },

    async updateResponse(id: string, { response }: { response: string }) {
      return db.update(responseTable).set({ response }).where(eq(responseTable.id, id)).returning();
    },

    async deleteResponse(id: string) {
      return db.update(responseTable).set({ isDeleted: true }).where(eq(responseTable.id, id)).returning();
    },

    async getJournalEntriesByUserId({ userId, isDeleted = false }: { userId: string; isDeleted?: boolean }) {
      return db.query.responseTable.findMany({
        where: (response, { and, eq }) => and(eq(response.userId, userId), eq(response.isDeleted, isDeleted)),
        with: {
          prompt: true,
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
      });
    },

    async getJournalEntryByResponseId({ responseId, isDeleted = false }: { responseId: string; isDeleted?: boolean }) {
      return db.query.responseTable.findFirst({
        where: (response, { and, eq }) => and(eq(response.id, responseId), eq(response.isDeleted, isDeleted)),
        with: {
          prompt: true,
        },
      });
    },
  };
};

export const journalEntryService = createJournalEntryService({ db });
