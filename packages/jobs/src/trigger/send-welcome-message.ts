import { email, db, llm } from '../lib';
import { task, retry } from '@trigger.dev/sdk/v3';

interface SendWelcomeEmailPayload {
  email: string;
  userId: string;
  name: string | null;
  promptTone: string | null;
  primaryGoal: string | null;
}

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: SendWelcomeEmailPayload) => {
    const prompt = await retry.onThrow(async () => {
      return await llm.generatePrompt({
        tone: payload.promptTone,
        goal: payload.primaryGoal,
      });
    }, {});

    const createPromptResponse = await db.createPrompt({
      prompt,
      userId: payload.userId,
      userEmail: payload.email,
    });

    if (!createPromptResponse) {
      throw new Error('Failed to create prompt');
    }

    const promptNumber = createPromptResponse.promptNumber;

    await retry.onThrow(async () => {
      return await email.sendPrompt({
        prompt,
        to: payload.email,
        name: payload.name ?? 'Anon',
        senderUsername: 'innkeeper-staging',
        subject: `Innkeeper Journal Prompt #${promptNumber}`,
      });
    }, {});
  },
});
