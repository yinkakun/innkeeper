import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createId } from '@paralleldrive/cuid2';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const authRouter = createTRPCRouter({
  requestEmailOtp: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.db.getUserByEmail({ email: input.email });

    if (existingUser) {
      const otp = await ctx.db.generateEmailOtpCode({
        email: input.email,
        userId: existingUser.id,
      });
      console.log('OTP (existing user):', otp);
      // await sendWelcomeEmail(input.email, otp);
      return { success: true };
    }

    const newUser = await ctx.db.createUser({ id: `user_${createId()}`, email: input.email });
    if (!newUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' });

    const otp = await ctx.db.generateEmailOtpCode({
      email: input.email,
      userId: newUser.id,
    });

    // TODO: await sendAuthOtp(input.email, otp);
    console.log('New User Verification code:', otp);

    return { success: true };
  }),
  verifyEmailOtp: publicProcedure.input(z.object({ email: z.string().email(), otp: z.string() })).mutation(async ({ input, ctx }) => {
    const user = await ctx.db.getUserByEmail({ email: input.email });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const onboarded = await ctx.db.isUserOnboarded({ userId: user.id });
    const { isValid, reason } = await ctx.db.verifyEmailOtpCode({ userId: user.id, code: input.otp });
    if (!isValid) throw new TRPCError({ code: 'BAD_REQUEST', message: reason });

    const session = await ctx.lucia.createSession(user.id, {});
    const sessionCookie = ctx.lucia.createSessionCookie(session.id);
    ctx.hono.header('Set-Cookie', sessionCookie.serialize(), {
      append: true,
    });
    ctx.hono.set('user', user);
    ctx.hono.set('session', session);

    return { success: true, onboarded };
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const sessionId = ctx.hono.get('session')?.id;
    if (!sessionId) return { success: true };

    await ctx.lucia.invalidateSession(sessionId);

    ctx.hono.header('Set-Cookie', ctx.lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });

    return { success: true };
  }),
});
