import { serve } from 'inngest/lambda';
import { inngest, sendWeeklyInsights, pauseInactiveUsers, sendDailyPrompts } from '@innkeeper/inngest';

export const handler = serve({
  client: inngest,
  baseUrl: process.env.INNGEST_BASE_URL,
  functions: [sendWeeklyInsights, sendDailyPrompts, pauseInactiveUsers],
});
