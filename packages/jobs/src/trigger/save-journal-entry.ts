import { db } from '../lib';
import { task, retry, AbortTaskRunError } from '@trigger.dev/sdk/v3';

interface JournalEntryPayload {
  entry: string;
  subject: string;
  userEmail: string;
}

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async ({ entry, subject, userEmail }: JournalEntryPayload) => {
    const promptNumber = extractNumberAfterHash(subject);

    if (!userEmail) {
      throw new AbortTaskRunError('Email from address not found');
    }

    if (!promptNumber) {
      throw new AbortTaskRunError('Prompt number not found in email subject');
    }

    const prompt = await retry.onThrow(async () => {
      return await db.getPromptByUserEmailAndPromptNumber({
        email: userEmail,
        promptNumber: promptNumber,
      });
    }, {});

    if (!prompt) {
      throw new AbortTaskRunError('Prompt not found');
    }

    const entryResponse = await retry.onThrow(async () => {
      return await db.createJournalEntry({
        promptId: prompt.id,
        userId: prompt.userId,
        entry,
      });
    }, {});

    return { entryResponse };
  },
});

const extractNumberAfterHash = (text: string): number | undefined => {
  const match = text.match(/#(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : undefined;
};
