import { sendEmail, db } from '../lib';
import { logger, task, retry, AbortTaskRunError } from '@trigger.dev/sdk/v3';

interface JournalEntryPayload {
  // entry: string;
  // promptId: string;
  message: any;
}

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async ({ message }: JournalEntryPayload) => {
    console.log('Saving Journal Entry');
    console.log(JSON.stringify(message, null, 2));
    // const user = await retry.onThrow(
    //   async () => {
    //     return await db.getUserByPromptId({ promptId });
    //   },
    //   { maxAttempts: 3 },
    // );

    // if (!user) {
    //   logger.log('User not found');
    //   throw new AbortTaskRunError('User not found');
    // }

    // await db.createJournalEntry({ entry, promptId, userId: user.user.id });

    return {
      data: message,
      message: 'Journal Entry Saved',
    };
  },
});
