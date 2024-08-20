import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '../trpc';
import { UpdateJournalEntrySchema, CreateJournalEntrySchema } from '@innkeeper/db';

export const journalRouter = createTRPCRouter({
  addJournalEntry: protectedProcedure
    .input(
      CreateJournalEntrySchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;

      const newJournalEntry = await ctx.db.createJournalEntry({
        userId: user.id,
        entry: input.entry,
        promptId: input.promptId,
      });

      return newJournalEntry;
    }),
  updateJournalEntry: protectedProcedure
    .input(
      UpdateJournalEntrySchema.required({
        id: true,
      })
        .omit({
          userId: true,
        })
        .extend({
          entry: z.string(),
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedJournalEntry = await ctx.db.updateJournalEntry({
        id: input.id,
        entry: input.entry,
        userId: ctx.user.id,
      });
      return updatedJournalEntry;
    }),
  deleteJournalEntry: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const deletedJournalEntry = await ctx.db.deleteJournalEntry({
      id: input.id,
      userId: ctx.user.id,
    });
    return deletedJournalEntry;
  }),
  generatePrompt: protectedProcedure.mutation(async ({ ctx }) => {
    const prompt = await ctx.hono.get('llm').generatePrompt({ goal: null, tone: null });

    const user = ctx.user;
    // delay to simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPrompt = await ctx.db.createPrompt({
      userId: user.id,
      userEmail: user.email,
      prompt: prompt,
    });
    if (!newPrompt) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate prompt',
      });
    }
    return newPrompt;
  }),
  deletePrompt: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const deletedPrompt = await ctx.db.deletePrompt({
      id: input.id,
      userId: ctx.user.id,
    });
    return deletedPrompt;
  }),
  getPrompts: protectedProcedure.query(async ({ ctx }) => {
    const prompts = await ctx.db.getPromptsByUserId({
      userId: ctx.user.id,
    });
    if (!prompts) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get prompts',
      });
    }
    return prompts;
  }),
});
