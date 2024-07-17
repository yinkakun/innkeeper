import { createDb } from '@innkeeper/db';
import { logger, task, wait } from '@trigger.dev/sdk/v3';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const db = createDb(DATABASE_URL);

export const helloWorldTask = task({
  id: 'hello-world',

  run: async (payload: unknown, { ctx }) => {
    logger.log('Hello, world!', { payload, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: 'Hello, world!',
    };
  },
});
