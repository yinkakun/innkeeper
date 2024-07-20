import { db, email } from '@innkeeper/service';
import { task, retry, logger, schedules } from '@trigger.dev/sdk/v3';

export const weeklyInsightsCron = schedules.task({
  // Every Sunday at midnight
  cron: '0 0 * * 0',
  id: 'weekly-insights',
  run: async () => {
    logger.log('Generating weekly insights');
    const users = await retry.onThrow(async () => await db.getUsers(), { maxAttempts: 3 });

    if (users.length === 0) {
      return { message: 'No users found' };
    }

    await generateAndSendInsights.batchTrigger(
      users.map(({ email, id, name }) => ({
        payload: {
          email,
          name,
          userId: id,
        },
      })),
    );

    return { message: 'Weekly insights sent' };
  },
});

interface GenerateAndSendInsightsPayload {
  name: string;
  email: string;
  userId: string;
}

export const generateAndSendInsights = task({
  id: 'generate-and-send-insights',
  run: async (payload: GenerateAndSendInsightsPayload) => {
    // const insights = await retry.onThrow(async () => await llm.generateInsights({ userId: payload.userId }), { maxAttempts: 3 });
    // await email.weeklyInsights({ email: payload.email, name: payload.name, insights });
  },
});
