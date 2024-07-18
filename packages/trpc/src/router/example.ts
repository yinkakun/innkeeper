import { z } from 'zod';
import { helloWorldTask } from '@innkeeper/jobs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),
  getSecretMessage: protectedProcedure.query(async ({ ctx }) => {
    ctx.configureTriggerClient();
    await helloWorldTask.trigger({ message: '' });
    return 'you can now see this secret message!';
  }),
});
