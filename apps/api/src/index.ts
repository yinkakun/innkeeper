import { Hono } from 'hono';
import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { createDb } from '@innkeeper/db';
import { trpcServer } from '@hono/trpc-server';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { createClient } from '@supabase/supabase-js';
import { appRouter, createContext } from '@innkeeper/trpc';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';
import type { User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js';




interface Variables {
  user: SupabaseUser | null;
  db: ReturnType<typeof createDb>;
  configureTriggerClient: () => void;
}

// always update this when you run `yarn types` to update the environment variables
interface Bindings {
  ENVIRONMENT: string;
  DATABASE_URL: string;
  SUPABASE_URL: string;
  TRIGGER_API_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export type HonoContext = Context<HonoOptions>;
interface HonoOptions { Bindings: Bindings; Variables: Variables }
const app = new Hono<HonoOptions>();

const dbMiddleware = createMiddleware<HonoOptions>(async (ctx, next) => {
  const db = createDb(ctx.env.DATABASE_URL);
  ctx.set('db', db);
  await next();
});

// trigger.dev requires to manually configure the env vars since process.env is not available in cloudflare workers
const triggerMiddleware = createMiddleware<HonoOptions>(async (ctx, next) => {
  ctx.set('configureTriggerClient', () => {
    configureTriggerClient({
      secretKey: ctx.env.TRIGGER_API_KEY,
    });
  });
  await next();
});

interface GetAuthenticatedUser {
  accessToken?: string;
  refreshToken?: string;
  supabase: SupabaseClient;
}

const getUser = async ({ accessToken, refreshToken, supabase }: GetAuthenticatedUser): Promise<SupabaseUser> => {
  const userResponse = await supabase.auth.getUser(accessToken);
  if (!userResponse.error ) return userResponse.data.user;

  // if the access token is invalid, try to refresh the session
  if (!refreshToken) throw new Error('No refresh token available');
  const refreshedSession = await supabase.auth.refreshSession({ refresh_token: refreshToken });
  if (!refreshedSession.error && refreshedSession.data.user) return refreshedSession.data.user;

  // if we reach this point, the user is not authenticated
  throw new Error('Failed to refresh session');
};

const authMiddleware = createMiddleware<HonoOptions>(async (ctx, next) => {
  const accessToken = getCookie(ctx, 'access_token');
  const refreshToken = getCookie(ctx, 'refresh_token');
  const supabase = createClient(ctx.env.SUPABASE_URL, ctx.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const user = await getUser({ supabase, accessToken, refreshToken });
    ctx.set('user', user);
    await next();
  } catch (error) {
    console.error('Error authenticating user', error);
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
});

app.use(dbMiddleware);
app.use(authMiddleware);
app.use(triggerMiddleware);

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: (options, ctx: HonoContext) => {
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
} satisfies ExportedHandler<Bindings> 


