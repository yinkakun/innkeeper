import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { UpdateJournalEntrySchema, CreateJournalEntrySchema } from '@innkeeper/db';
import { TRPCError } from '@trpc/server';

export const journalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      CreateJournalEntrySchema.omit({
        userId: true,
        promptId: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      // create empty prompt
      const newPrompt = await ctx.db.createPrompt({
        body: '',
        userId: user.id,
        title: 'Untitled',
      });

      if (!newPrompt) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create prompt',
        });
      }

      const newJournalEntry = await ctx.db.createJournalEntry({
        userId: user.id,
        entry: input.entry,
        promptId: newPrompt.id,
      });

      return newJournalEntry;
    }),
  update: protectedProcedure
    .input(
      UpdateJournalEntrySchema.required({
        id: true,
      }).omit({
        userId: true,
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
