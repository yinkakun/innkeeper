import { task, retry, schedules } from '@trigger.dev/sdk/v3';
import { email, db, llm } from '../lib';
import { getHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const PERIOD_TO_HOUR = {
  morning: 8, // 8 AM
  afternoon: 13, // 1 PM
  evening: 18, // 6 PM
  night: 21, // 9 PM
};

type Period = keyof typeof PERIOD_TO_HOUR;

const getUserLocalHour = (timezone: string): number => {
  const zonedTime = toZonedTime(new Date(), timezone);
  return getHours(zonedTime);
};

const shouldSendPrompt = (userTimezone: string | null, period: Period | null): boolean => {
  if (!userTimezone || !period) return false;
  return getUserLocalHour(userTimezone) === PERIOD_TO_HOUR[period];
};

export const sendDailyPromptsCron = schedules.task({
  // Every hour
  cron: '0 * * * *',
  id: 'send-daily-prompts',
  run: async () => {
    const users = await retry.onThrow(async () => {
      return await db.getUsersWithEmailNotificationsEnabled();
    }, {});

    if (users.length === 0) {
      return { message: 'No users' };
    }

    const usersToPrompt = users.filter(({ timezone, promptPeriod }) => shouldSendPrompt(timezone, promptPeriod));

    await sendPrompt.batchTrigger(
      usersToPrompt.map(({ email, id: userId, primaryGoal, promptTone, name }) => ({
        payload: {
          name,
          email,
          userId,
          promptTone,
          primaryGoal,
        },
      })),
    );

    return { message: `Sent prompts to ${usersToPrompt.length} users` };
  },
});

interface SendPromptPayload {
  email: string;
  userId: string;
  name: string | null;
  promptTone: string | null;
  primaryGoal: string | null;
}

export const sendPrompt = task({
  id: 'send-prompt',
  run: async (payload: SendPromptPayload) => {
    const response = await retry.onThrow(async () => {
      return await llm.generatePrompt({
        tone: payload.promptTone,
        goal: payload.primaryGoal,
      });
    }, {});

    const prompt = response.content[0]?.type === 'text' ? response.content[0].text : '';

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
        name: 'User',
        to: payload.email,
        senderUsername: 'innkeeper-staging',
        subject: `Innkeeper Journal Prompt #${promptNumber}`,
      });
    }, {});

    return { message: 'Prompt sent', prompt: prompt };
  },
});
