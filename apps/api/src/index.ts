import { Hono } from 'hono';
import { serve } from 'inngest/hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from '@innkeeper/trpc';

import {
  inngest,
  sendPrompt,
  dailyPromptsCron,
  saveJournalEntry,
  sendWelcomeEmail,
  sendWeeklyInsightsCron,
  pauseInactiveUsersCron,
} from '@innkeeper/inngest';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.on(
  ['GET', 'PUT', 'POST'],
  '/api/inngest',
  serve({
    client: inngest,
    functions: [sendPrompt, dailyPromptsCron, saveJournalEntry, sendWelcomeEmail, sendWeeklyInsightsCron, pauseInactiveUsersCron],
  }),
);

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: createContext,
  }),
);

export default app;
