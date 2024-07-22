import { Hono } from 'hono';
import type { Context } from 'hono';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { getCookie, setCookie } from 'hono/cookie';
import { prettyJSON } from 'hono/pretty-json';
import { initDbService } from '@innkeeper/service';
import { trpcServer } from '@hono/trpc-server';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { ForwardableEmailMessage } from './types';
import { appRouter, createContext } from '@innkeeper/trpc';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';
import { generateState, generateCodeVerifier } from 'arctic';
import { z } from 'zod';
import { initLucia, google } from './lucia';
import { OAuth2RequestError, ArcticFetchError } from 'arctic';
import type { User, Session } from 'lucia';
import { generateIdFromEntropySize } from 'lucia';

interface Variables {
  db: ReturnType<typeof initDbService>;
  user: User | null;
  session: Session | null;
}

// always update this when you run `yarn types` to update the environment variables
interface Bindings {
  DATABASE_URL: string;
  ENVIRONMENT: string;
  TRIGGER_API_KEY: string;
}

export type HonoContext = Context<HonoOptions>;
interface HonoOptions {
  Bindings: Bindings;
  Variables: Variables;
}
const app = new Hono<HonoOptions>();

const dbMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  const db = initDbService(c.env.DATABASE_URL);
  c.set('db', db);
  await next();
});

// trigger.dev requires to manually configure the env vars since process.env is not available in cloudflare workers
const triggerMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  configureTriggerClient({
    secretKey: c.env.TRIGGER_API_KEY,
  });
  await next();
});

const authMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  const lucia = initLucia({ databaseUrl: c.env.DATABASE_URL, secure: c.env.ENVIRONMENT !== 'development' });
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  c.set('user', user);
  c.set('session', session);
  return next();
});

app.use(csrf());
app.use(logger());
app.use(dbMiddleware);
app.use(prettyJSON());
app.use(triggerMiddleware);

app.get('/', (ctx) => {
  return ctx.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/auth/google', (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['email']);

  setCookie(c, 'google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10, // 10 mins
    secure: c.env.ENVIRONMENT !== 'development',
  });

  setCookie(c, 'google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10, // 10 mins
    secure: c.env.ENVIRONMENT !== 'development',
  });

  return c.redirect(url.toString());
});

app.get('/auth/google/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');

  const storedState = getCookie(c, 'google_oauth_state');
  const storedCodeVerifier = getCookie(c, 'google_code_verifier');

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    throw new HTTPException(400, { message: 'Invalid request' });
  }

  const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier).catch((error) => {
    if (error instanceof OAuth2RequestError) {
      throw new HTTPException(400, { message: error.message });
    }
    if (error instanceof ArcticFetchError) {
      throw new HTTPException(500, { message: 'Failed to fetch tokens', cause: error.cause });
    }
  });

  const lucia = initLucia({ databaseUrl: c.env.DATABASE_URL, secure: c.env.ENVIRONMENT !== 'development' });

  // use tokens.access_token to fetch user email
  const userEmail = 'user@email.com';

  const existingUser = await c.get('db').getUserByEmail({ email: userEmail });

  // if existing user, create a session and redirect to the dashboard
  if (existingUser) {
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header('Set-Cookie', sessionCookie.serialize(), {
      append: true,
    });
    return c.redirect('/dashboard');
  }

  const userId = generateIdFromEntropySize(10);
  const user = await c.get('db').createUser({ id: userId, email: userEmail });
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  c.header('Set-Cookie', sessionCookie.serialize(), {
    append: true,
  });
  return c.redirect('/onboarding');
});

const emailOtpSchema = z.object({
  email: z.string().email(),
});

// For both sign up and sign in
// TODO: rate limit endpoint
app.post('/auth/email-otp', async (c) => {
  const body = await c.req.parseBody();
  const { email } = emailOtpSchema.parse(body);
  const existingUser = await c.get('db').getUserByEmail({ email });

  if (existingUser) {
    const verificationCode = await c.get('db').generateEmailOtpCode({
      email,
      userId: existingUser.id,
    });

    // send email with verification code
    // await sendVerificationCode(email, verificationCode);
    console.log('Existing User Verification code:', verificationCode);

    return c.json({ success: true });
  }

  // create user
  const userId = generateIdFromEntropySize(10);
  const newUser = await c.get('db').createUser({ id: userId, email });
  const verificationCode = await c.get('db').generateEmailOtpCode({
    email,
    userId: newUser.id,
  });

  // send email with verification code
  // await sendVerificationCode(email, verificationCode);
  console.log('New User Verification code:', verificationCode);

  return c.json({ success: true });
});

// to verify the email,

const verifyEmailOtpSchema = z.object({
  email: z.string().email(),
  code: z.number().max(6).min(6),
});

app.post('/auth/verify-email-otp', async (c) => {
  const body = await c.req.parseBody();
  const { email, code } = verifyEmailOtpSchema.parse(body);

  if (!code || !email) {
    throw new HTTPException(400, { message: 'Invalid request' });
  }

  const user = await c.get('db').getUserByEmail({ email });
  if (!user) {
    throw new HTTPException(400, { message: 'User not found' });
  }

  const isValidCode = await c.get('db').verifyEmailOtpCode({ userId: user.id, code: code.toString() });

  if (!isValidCode) {
    throw new HTTPException(400, { message: 'Invalid code' });
  }

  const lucia = initLucia({ databaseUrl: c.env.DATABASE_URL, secure: c.env.ENVIRONMENT !== 'development' });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.header('Set-Cookie', sessionCookie.serialize(), {
    append: true,
  });

  c.set('user', user);
  c.set('session', session);

  return c.json({ success: true });
});

app.post('/logout', authMiddleware, async (c) => {
  const lucia = initLucia({ databaseUrl: c.env.DATABASE_URL, secure: c.env.ENVIRONMENT !== 'development' });
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    return c.json({ success: true });
  }

  await lucia.invalidateSession(sessionId);

  c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
    append: true,
  });

  return c.json({ success: true });
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
  email: async (message: ForwardableEmailMessage, env: Bindings) => {
    console.log('Incoming env)', env);
    console.log('Incoming message)', message);
  },
};
