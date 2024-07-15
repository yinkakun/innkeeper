import { inngest } from './client';

export const pauseInactiveUsersCron = inngest.createFunction(
  {
    id: 'pause-inactive-users',
    name: 'Pause Inactive Users',
  },
  {
    cron: '0 0 * * *', // every day
  },
  async ({ step }) => {
    console.log('Pausing inactive users');

    // send email to inactive users if inactive for 3 days
    await step.run('send-email-to-inactive-users', () => {
      // await sendEmailToInactiveUsers
    });

    // wait for 2 days
    await step.sleep('wait-for-2-days', '2d');

    // pause inactive users if inactive for 5 days
    await step.run('pause-users', () => {
      // await pauseUsers
    });
  },
);
