import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { trpcServer } from '@hono/trpc-server';
import { authRouter } from './routes/auth';
import { HonoOptions, Bindings, HonoContext } from './context';
import { appRouter, createContext } from '@innkeeper/trpc';
import type { ReadableStream } from 'web-streams-polyfill';
import { authMiddleware, dbMiddleware, triggerMiddleware } from './middleware';

export type { HonoContext } from './context';

const app = new Hono<HonoOptions>();
app.route('/auth', authRouter);

app.use(csrf());
app.use(logger());
app.use(prettyJSON());
app.use(dbMiddleware);
app.use(authMiddleware);
app.use(triggerMiddleware);

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
    console.log('Incoming env)', env);
    console.log('Incoming message)', message);
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
