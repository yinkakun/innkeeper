import { Hono } from 'hono';
import { serve } from 'inngest/hono';
import { drizzle } from 'drizzle-orm/d1';
import { appRouter } from '@innkeeper/trpc';
import { trpcServer } from '@hono/trpc-server';
import type { DbClient } from '@innkeeper/db/client';

import {
  inngest,
  sendPrompt,
  dailyPromptsCron,
  saveJournalEntry,
  sendWelcomeEmail,
  pauseInactiveUsersCron,
  sendWeeklyInsightsCron,
} from './inngest';

export interface Env {
  DB: D1Database;
  INNGEST_EVENT_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/', (context) => {
  return context.json({ message: 'Hello!' });
});

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (_options, context) => {
      console.log('Incoming Context)', context);
      return {
        // var1: context.env.MY_VAR1,
        // var2: context.req.header('X-VAR2'),
      };
    },
  }),
);

app.on(
  ['GET', 'PUT', 'POST'],
  '/api/inngest',
  serve({
    client: inngest,
    functions: [dailyPromptsCron, pauseInactiveUsersCron, saveJournalEntry, sendPrompt, sendWeeklyInsightsCron, sendWelcomeEmail],
  }),
);

export default {
  fetch: app.fetch,
  email: async (message, env, context) => {
    console.log('Incoming)', env.INNGEST_EVENT_KEY);
  },
} satisfies ExportedHandler<Env>;
