import { TRPCError } from '@trpc/server';
import { OnboardUserSchema, UpdateUserSchema } from '@innkeeper/db';
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
    // await ctx.lucia.
    const deletedUser = await ctx.db.deleteUser({ userId: user.id });
    return deletedUser;
  }),
});
