import { db } from '@innkeeper/db';
import { schedules, task, retry, logger } from '@trigger.dev/sdk/v3';
import { send } from 'process';

export const pauseIdleUsers = schedules.task({
  cron: '0 0 * * *',
  id: 'pause-idle-users',
  run: async (payload) => {
    console.log('Pausing idle users', payload);

    const inactiveUsers3days = await retry.onThrow(
      async () => {
        return await db.getInactiveUsers({ days: 3 });
      },
      { maxAttempts: 3 },
    );

    if (inactiveUsers3days.length === 0) {
      logger.log('No inactive users to notify');
    }

    await emailInactiveUser.batchTrigger(inactiveUsers3days.map(({ email }) => ({ payload: { email } })));

    const inactiveUsers5days = await retry.onThrow(
      async () => {
        return await db.getInactiveUsers({ days: 5 });
      },
      { maxAttempts: 3 },
    );

    if (inactiveUsers5days.length === 0) {
      logger.log('No inactive users to pause');
    }

    await pauseUser.batchTrigger(inactiveUsers5days.map(({ id }) => ({ payload: { userId: id } })));
  },
});

interface EmailInactiveUserPayload {
  email: string;
}

export const emailInactiveUser = task({
  id: 'send-email-to-inactive-user',
  run: async (payload: EmailInactiveUserPayload) => {
    // TODO: send email to inactive user
    // await email.inactiveUser({ email: payload.email });
  },
});

interface PauseUserPayload {
  userId: string;
}

export const pauseUser = task({
  id: 'pause-user',
  run: async ({ userId }: PauseUserPayload) => {
    await db.pauseUser({ userId });
  },
});
