import { task, retry, logger, schedules } from '@trigger.dev/sdk/v3';
import { email, db } from '../service';

export const sendDailyPromptsCron = schedules.task({
  // Every hour
  cron: '0 * * * *',
  id: 'send-daily-prompts',
  run: async () => {
    const hourUtc = new Date().getUTCHours();
    const users = await retry.onThrow(async () => await db.getUsersToPromptByCurrentHour({ hourUtc }), { maxAttempts: 3 });

    if (users.length === 0) {
      return { message: 'No users found' };
    }

    await sendPrompt.batchTrigger(
      users.map(({ email, id, name }) => ({
        payload: {
          email,
          userId: id,
          name: name ?? '',
        },
      })),
    );

    return { message: 'Daily prompts sent' };
  },
});

interface SendPromptPayload {
  name: string;
  email: string;
  userId: string;
}

export const sendPrompt = task({
  id: 'send-prompt',
  run: async (payload: SendPromptPayload) => {
    // const prompt = await retry.onThrow(async () => llm.generatePrompt({ userId: payload.userId }), { maxAttempts: 3 });
    // await email.prompt({ email: payload.email, name: payload.name, prompt });
  },
});
