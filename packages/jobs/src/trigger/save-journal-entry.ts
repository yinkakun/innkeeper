import { sendEmail, db } from '../lib';
import { logger, task, retry, AbortTaskRunError } from '@trigger.dev/sdk/v3';
import type { Email } from 'postal-mime';
interface JournalEntryPayload {
  email: Email;
}

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async ({ email }: JournalEntryPayload) => {
    logger.info('Saving Journal Entry 🔥');
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

    return { email };
  },
});
