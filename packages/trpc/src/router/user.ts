import { TRPCError } from '@trpc/server';
import { tasks } from '@trigger.dev/sdk/v3';
import type { sendWelcomeEmail } from '@innkeeper/jobs';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { OnboardUserSchema, UpdateUserSchema } from '@innkeeper/db';

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
      if (!updatedUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to onboard user',
        });
      }
      await tasks.trigger<typeof sendWelcomeEmail>('send-welcome-email', {
        name: updatedUser.name,
        userId: updatedUser.id,
        email: updatedUser.email,
        promptTone: updatedUser.promptTone,
        primaryGoal: updatedUser.primaryGoal,
      });
      return updatedUser;
    }),
  update: protectedProcedure
    .input(
      UpdateUserSchema.omit({
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
      const updatedUser = await ctx.db.updateUser({
        id: user.id,
        ...input,
      });
      return updatedUser;
    }),
  isOnboarded: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.hono.get('user');
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }
    return ctx.db.isUserOnboarded({ userId: user.id });
  }),
  details: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.hono.get('user');
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }
    return await ctx.db.getUserById({ userId: user.id });
  }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.hono.get('user');
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }
    const deletedUser = await ctx.db.deleteUser({ userId: user.id });
    return deletedUser;
  }),
});
