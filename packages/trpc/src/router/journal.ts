import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { UpdateJournalEntrySchema, CreateJournalEntrySchema } from '@innkeeper/db';
import { TRPCError } from '@trpc/server';

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
  generatePrompt: protectedProcedure.mutation(async ({ input, ctx }) => {
    const generatedPrompt = `The unexamined life is not worth living, said Socrates. Consider a belief or behavior you've never questioned. How has your cultural background shaped this aspect of yourself? If you were born into a different culture, how might your perspective on this matter change? Reflect on the possibility that what you consider 'normal' or 'right' might simply be a product of your environment. How does this realization affect your sense of self?`;

    const user = ctx.user;
    // delay to simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPrompt = await ctx.db.createPrompt({
      userId: user.id,
      userEmail: user.email,
      prompt: generatedPrompt,
    });
    if (!newPrompt) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate prompt',
      });
    }
    return newPrompt;
  }),
  regeneratePrompt: protectedProcedure
    .input(
      z.object({
        promptId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const generatedPrompt = `The unexamined life is not worth living, said Socrates. Consider a belief or behavior you've never questioned. How has your cultural background shaped this aspect of yourself? If you were born into a different culture, how might your perspective on this matter change? Reflect on the possibility that what you consider 'normal' or 'right' might simply be a product of your environment. How does this realization affect your sense of self?`;
      const updatedPrompt = await ctx.db.updatePrompt({
        id: input.promptId,
        prompt: generatedPrompt,
        userId: ctx.user.id,
      });
      return updatedPrompt;
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
