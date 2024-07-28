import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { UpdateJournalEntrySchema, CreateJournalEntrySchema } from '@innkeeper/db';

export const journalRouter = createTRPCRouter({
  create: protectedProcedure.input(CreateJournalEntrySchema).mutation(async ({ input, ctx }) => {
    const user = ctx.user;
    const newJournalEntry = await ctx.db.createJournalEntry({
      userId: user.id,
      promptId: input.promptId,
      entry: input.entry,
    });
    return newJournalEntry;
  }),
  update: protectedProcedure
    .input(
      UpdateJournalEntrySchema.required({
        id: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedJournalEntry = await ctx.db.updateJournalEntry({
        id: input.id,
        entry: input.entry,
      });
      return updatedJournalEntry;
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const deletedJournalEntry = await ctx.db.deleteJournalEntry({
      id: input.id,
    });
    return deletedJournalEntry;
  }),
  entries: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    return ctx.db.getJournalEntriesByUserId({ userId: user.id });
  }),
});
