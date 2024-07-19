import { db } from '@innkeeper/db';
import { logger, task, wait } from '@trigger.dev/sdk/v3';

export const sendWelcomeEmail = task({
  id: 'hello-world',

  run: async (payload: unknown, { ctx }) => {
    logger.log('Hello, world!', { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: 'Hello, world!',
    };
  },
});
