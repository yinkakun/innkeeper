import { task, retry, logger, schedules } from '@trigger.dev/sdk/v3';
import { sendEmail, db, llm } from '../lib';
import Anthropic from '@anthropic-ai/sdk';
import { getHours } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

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
    const users = await retry.onThrow(async () => await db.getUsersWithEmailPromptsEnabled(), { maxAttempts: 3 });

    if (users.length === 0) {
      return { message: 'No users' };
    }

    const usersToPrompt = users.filter(({ timezone, promptPeriod }) => shouldSendPrompt(timezone, promptPeriod));

    await sendPrompt.batchTrigger(
      usersToPrompt.map(({ email, id, name, primaryGoal, promptTone }) => ({
        payload: {
          email,
          userId: id,
          name: name ?? '',
          promptTone: promptTone ?? '',
          primaryGoal: primaryGoal ?? '',
        },
      })),
    );

    return { message: `Sent prompts to ${usersToPrompt.length} users` };
  },
});

interface SendPromptPayload {
  // email: string;
  promptTone: string;
  primaryGoal: string;
}

export const sendPrompt = task({
  id: 'send-prompt',
  run: async (payload: SendPromptPayload) => {
    const journalPrompt = await retry.onThrow(
      async () => {
        return await llm.generatePrompt({
          goal: payload.primaryGoal,
          tone: payload.promptTone,
        });
      },
      { maxAttempts: 3 },
    );

    return { message: 'Prompt sent', prompt: journalPrompt };
  },
});
