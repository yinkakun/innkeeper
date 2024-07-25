import { db } from '../db';
import { logger, task, retry, AbortTaskRunError } from '@trigger.dev/sdk/v3';

interface JournalEntryPayload {
  entry: string;
  promptId: string;
}

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async ({ entry, promptId }: JournalEntryPayload) => {
    console.log('Saving Journal Entry');
    const user = await retry.onThrow(
      async () => {
        return await db.getUserByPromptId({ promptId });
      },
      { maxAttempts: 3 },
    );

    if (!user) {
      logger.log('User not found');
      throw new AbortTaskRunError('User not found');
    }

    await db.createJournalEntry({ entry, promptId, userId: user.user.id });
  },
});
