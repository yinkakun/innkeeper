import { db, ai, email } from '@innkeeper/service';
import { task, retry, logger, schedules } from '@trigger.dev/sdk/v3';

export const sendDailyPromptsCron = schedules.task({
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
          name,
          userId: id,
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
    const prompt = await retry.onThrow(async () => ai.generatePrompt({ userId: payload.userId }), { maxAttempts: 3 });
    await email.prompt({ email: payload.email, name: payload.name, prompt });
  },
});
