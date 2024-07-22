import { z } from 'zod';
import { tasks } from '@trigger.dev/sdk/v3';
import { sendWelcomeEmail } from '@innkeeper/jobs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(z.object({ email: z.string().email() })).query(async ({ input, ctx }) => {
    // unified auth: If user email not found, create user
    // check if user exists
    // let isNewUser = false;
    const user = await ctx.db.getUserByEmail({ email: input.email });
    // if (!user) {
    //   isNewUser = true;
    //   // create user
    //   const { error, data } = await ctx.supabase.auth.signInWithOtp({ email: input.email });
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // }
  }),
});
