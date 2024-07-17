import { Hono, Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import type { DbClient } from '@innkeeper/db';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from '@innkeeper/trpc';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';

import { createMiddleware } from 'hono/factory';

type Variables = {
  db: DbClient;
  configureTriggerClient: () => void;
};

// always update this type when you add new bindings and run `yarn types`
type Bindings = {
  DB: D1Database;
  ENVIRONMENT: string;
  DATABASE_ID: string;
  TRIGGER_API_KEY: string;
  TRIGGER_API_URL: string;
};

export type HonoContext = Context<HonoOptions>;
type HonoOptions = { Bindings: Bindings; Variables: Variables };

const app = new Hono<HonoOptions>();

const dbMiddleware = createMiddleware<HonoOptions>(async (ctx, next) => {
  ctx.set('db', drizzle(ctx.env.DB));
  await next();
});

const triggerMiddleware = createMiddleware<HonoOptions>(async (ctx, next) => {
  ctx.set('configureTriggerClient', () => {
    configureTriggerClient({
      baseURL: ctx.env.TRIGGER_API_URL,
      secretKey: ctx.env.TRIGGER_API_KEY,
    });
  });
  await next();
});

app.use(dbMiddleware);
app.use(triggerMiddleware);

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (options, ctx: HonoContext) => {
      console.log('Incoming Context', ctx);
      return createContext(options, ctx);
    },
  }),
);

app.get('/', (context) => {
  return context.json({ message: 'Hello World!' });
});

export default {
  fetch: app.fetch,
  email: async (message, env) => {
    console.log('Incoming env)', env);
    console.log('Incoming message)', message);
  },
} satisfies ExportedHandler<Bindings>;
