import { logger, task, wait } from '@trigger.dev/sdk/v3';

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async (payload: { promptId: string; entry: string }, ctx) => {
    console.log('Saving Journal Entry', payload);
  },
});
