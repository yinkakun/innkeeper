import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { trpcServer } from '@hono/trpc-server';
import { authRouter } from './routes/auth';
import { tasks } from '@trigger.dev/sdk/v3';
import type { saveJournalEntry } from '@innkeeper/jobs';
import type { HonoOptions, Bindings, HonoContext } from './context';
import { appRouter, createContext } from '@innkeeper/trpc';
import type { ReadableStream } from 'web-streams-polyfill';
import { authMiddleware, dbMiddleware, triggerMiddleware, emailMiddleware } from './middleware';
export type { HonoContext } from './context';
import PostalMime from 'postal-mime';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';

const app = new Hono<HonoOptions>();

app.use(csrf());
app.use(logger());
app.use(prettyJSON());
app.use(dbMiddleware);
app.use(authMiddleware);
app.use(emailMiddleware);
app.use(triggerMiddleware);

app.use(
  '/trpc/*',
  cors({
    credentials: true,
    origin: (ctx) => ctx,
  }),
);

app.route('/auth', authRouter);

app.get('/', (ctx) => {
  return ctx.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/trpc',
    createContext: (options, c: HonoContext) => {
      return createContext(options, c);
    },
  }),
);

export default {
  fetch: app.fetch,
  email: async (message: EmailMessage, env: Bindings) => {
    configureTriggerClient({
      secretKey: env.TRIGGER_API_KEY,
    });
    const parser = new PostalMime();
    const email = await parser.parse(message.raw);
    await tasks.trigger<typeof saveJournalEntry>('save-journal-entry', {
      email: email,
    });
  },
};

export interface EmailMessage {
  /**
   * Envelope From attribute of the email message.
   */
  readonly from: string;
  /**
   * Envelope To attribute of the email message.
   */
  readonly to: string;
  /**
   * Stream of the email message content.
   */
  readonly raw: ReadableStream<Uint8Array>;
  /**
   * An [Headers object](https://developer.mozilla.org/en-US/docs/Web/API/Headers).
   */
  readonly headers: Headers;
  /**
   * Size of the email message content.
   */
  readonly rawSize: number;
}
