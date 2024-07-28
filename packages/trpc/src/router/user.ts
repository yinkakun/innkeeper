import { TRPCError } from '@trpc/server';
import { OnboardUserSchema } from '@innkeeper/db';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  onboard: protectedProcedure
    .input(
      OnboardUserSchema.omit({
        id: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.hono.get('user');
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }
      const updatedUser = await ctx.db.onboardUser({
        id: user.id,
        name: input.name,
        timezone: input.timezone,
        promptTone: input.promptTone,
        primaryGoal: input.primaryGoal,
        promptPeriod: input.promptPeriod,
        promptFrequency: input.promptFrequency,
      });

      return updatedUser;
    }),
});
