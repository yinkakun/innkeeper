import { z } from 'zod';
import { tasks } from '@trigger.dev/sdk/v3';
import { sendWelcomeEmail } from '@innkeeper/jobs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),
  getSecretMessage: protectedProcedure.query(async ({ ctx }) => {
    // await tasks.trigger<typeof sendWelcomeEmail>('send-welcome-email', {
    //   name: '',
    //   email: '',
    // });
    await sendWelcomeEmail.trigger({
      email: '',
      name: '',
    });
    return 'you can now see this secret message!';
  }),
});
