import { db } from '../lib';
import type { Email } from 'postal-mime';
import { task, retry, AbortTaskRunError } from '@trigger.dev/sdk/v3';

interface JournalEntryPayload {
  email: Email;
}

export const saveJournalEntry = task({
  id: 'save-journal-entry',
  run: async ({ email }: JournalEntryPayload) => {
    const subject = email.subject || '';
    const userEmail = email.from.address;
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

    const emailText = email.text || '';
    const entry = extractLatestMessage(emailText);

    const entryResponse = await retry.onThrow(async () => {
      return await db.createJournalEntry({
        entry: entry || '',
        promptId: prompt.id,
        userId: prompt.userId,
      });
    }, {});

    return { entryResponse };
  },
});

const extractNumberAfterHash = (text: string): number | undefined => {
  const match = text.match(/#(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : undefined;
};

const extractLatestMessage = (emailText: string): string | undefined => {
  const separators = [/\nOn .* wrote:\n/, /\n-{3,}.*Original Message.*-{3,}\n/, /\n>.*\n/, /\nFrom:.*\nSent:.*\nTo:.*\nSubject:.*/];

  for (const separator of separators) {
    const parts = emailText.split(separator);
    if (parts.length > 1) {
      // get all content before the separator
      const latestContent = parts[0];

      // remove quoted lines
      return latestContent
        ?.split('\n')
        .filter((line) => !line.trim().startsWith('>') && !line.trim().startsWith('On ') && !line.includes(' wrote:'))
        .join('\n')
        .trim();
    }
  }

  return emailText.trim();
};
