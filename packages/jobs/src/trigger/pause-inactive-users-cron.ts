import { emailSender, db } from '../service';
import { schedules, task, retry, logger } from '@trigger.dev/sdk/v3';

export const pauseIdleUsersCron = schedules.task({
  // Every day at midnight
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

    await emailInactiveUser.batchTrigger(inactiveUsers3days.map(({ email, name }) => ({ payload: { email, name: name ?? '' } })));

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
  name: string;
  email: string;
}

export const emailInactiveUser = task({
  id: 'email-inactive-user',
  run: async (payload: EmailInactiveUserPayload) => {
    await emailSender.inactiveUser({ email: payload.email, name: payload.name });
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
