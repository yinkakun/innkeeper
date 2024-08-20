import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { trpcServer } from '@hono/trpc-server';
import { authRouter } from './routes/auth';
import { tasks } from '@trigger.dev/sdk/v3';
import type { saveJournalEntry } from '@innkeeper/jobs';
import { appRouter, createContext } from '@innkeeper/trpc';
import type { HonoOptions, Bindings, HonoContext } from './context';
import { authMiddleware, dbMiddleware, triggerMiddleware, emailMiddleware } from './middleware';
export type { HonoContext } from './context';
import PostalMime, { RawEmail } from 'postal-mime';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';
import EmailReplyParser from '@innkeeper/email-reply-parser';

const app = new Hono<HonoOptions>();

app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    credentials: true,
    origin: [c.env.APP_URL, 'http://localhost:5173'],
  });
  return corsMiddlewareHandler(c, next);
});

app.use(csrf());
app.use(logger());
app.use(prettyJSON());
app.use(dbMiddleware);
app.use(authMiddleware);
app.use(emailMiddleware);
app.use(triggerMiddleware);

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
    const reply = new EmailReplyParser().read(email.text || '');
    await tasks.trigger<typeof saveJournalEntry>('save-journal-entry', {
      subject: email.subject || '',
      entry: reply.getVisibleText(),
      userEmail: email.from.address || '',
    });
  },
};

export interface EmailMessage {
  readonly to: string;
  readonly from: string;
  readonly raw: RawEmail;
  readonly headers: Headers;
}
