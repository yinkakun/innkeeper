import { db } from './db';
import { schedules, task } from '@trigger.dev/sdk/v3';

export const pauseIdleUsers = schedules.task({
  // cron: '0 0 * * *',
  id: 'pause-idle-users',
  run: async (payload) => {
    console.log('Pausing idle users', payload);

    // get inactive users for 3 days
    // const inactiveUsers3days = await db.getInactiveUsers({ days: 3 })
    // if no inactive users, return { message: 'No inactive users to notify' }

    // if inactive users, batchTrigger emailInactiveUser
    // set notifiedInactivity to true
    // await emailInactiveUser.batchTrigger(inactiveUsers3days.map(({ email }) => ({ payload: { email } })));

    // get inactive users for 5 days, and notifiedInactivity is true
    // const stillInactiveUsers = await db.getInactiveUsers({ days: 5, notifiedInactivity: true })

    // if no inactive users for 5 days, return { message: 'No inactive users to pause' }

    // if 5 days inactive users, batchTrigger pauseUser
    // set notifiedInactivity to false, and set isActive to false
    // await pauseUser.batchTrigger(inactiveUsers3days.map(({ email }) => ({ payload: { email } })));

    // return { message: 'Paused inactive users' }
  },
});

interface EmailInactiveUserPayload {
  email: string;
}

const emailInactiveUser = task({
  id: 'send-email-to-inactive-user',
  run: async (payload: EmailInactiveUserPayload) => {
    console.log('Sending email to inactive user', payload);

    // send email to inactive user
    // mark user as inactive
  },
});

interface PauseUserPayload {
  email: string;
}

const pauseUser = task({
  id: 'pause-user',
  run: async (payload: PauseUserPayload) => {
    console.log('Pausing user', payload);

    // pause user
  },
});
