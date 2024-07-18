import { inngest } from './client';
import { createDb } from '@innkeeper/db';

const db = createDb('');

export const saveJournalEntry = inngest.createFunction(
  {
    id: 'save-journal-entry',
    name: 'Save Journal Entry',
  },
  {
    event: 'app/save.journal.entry',
  },
  async ({ event, step }) => {
    console.log('Saving Journal Entry');
    const { entry, promptId } = event.data;

    // const user = await step.run('get-user', async () => {
    //   return db.getUserByPromptId({ promptId });
    // });

    // if (!user) {
    //   return {
    //     success: false,
    //     message: 'User not found',
    //   };
    // }

    await step.run('save-journal-entry', async () => {
      // await db.createJournalEntry({ entry, userId: user.user.id });
    });

    return {
      success: true,
      message: 'Journal Entry saved',
    };
  },
);
