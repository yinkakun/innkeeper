import { inngest } from './client';

export const sendWeeklyInsights = inngest.createFunction(
  {
    name: 'send-weekly-insights',
    id: 'app/save.journal.entry',
  },
  {
    cron: '0 0 * * 0', // every Sunday
  },
  async ({ event, step }) => {
    console.log('Saving Journal Entry');

    await step.run('send-weekly-insights', () => {
      // await sendWeeklyInsights(); using ses
    });
  },
);
