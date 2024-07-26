import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { trpcServer } from '@hono/trpc-server';
import { authRouter } from './routes/auth';
import { tasks } from '@trigger.dev/sdk/v3';
import { saveJournalEntry } from '@innkeeper/jobs';
import type { HonoOptions, Bindings, HonoContext } from './context';
import { appRouter, createContext } from '@innkeeper/trpc';
import type { ReadableStream } from 'web-streams-polyfill';
import { authMiddleware, dbMiddleware, triggerMiddleware, emailMiddleware } from './middleware';
import { HTTPException } from 'hono/http-exception';
export type { HonoContext } from './context';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';

const app = new Hono<HonoOptions>();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    c.text('🌓🌓🌓🌓🌓🌓🌓🌓🌓');
    console.log('🔥🔥🔥🔥🔥🔥');
    return err.getResponse();

    const res = new Response(err.message);
  }
  c.text('🍃🍃🍃🍃🍃🍃🍃🍃🍃', {});

  throw err;
});

app.use(csrf());
app.use(logger());
app.use(prettyJSON());
app.use(dbMiddleware);
app.use(authMiddleware);
app.use(emailMiddleware);
app.use(triggerMiddleware);

app.use('/trpc/*', cors());

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
    // TODO: trigger incoming email task
    await tasks.trigger<typeof saveJournalEntry>('save-journal-entry', {
      message: message,
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
