import { z } from 'zod';
import { initLucia } from './auth';
import { HonoOptions } from './app';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { initDbService } from '@innkeeper/service';
import { configure as configureTriggerClient } from '@trigger.dev/sdk/v3';

// export const validationMiddleware = createMiddleware<HonoOptions>(async (c, next) => {});

export const authMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  const lucia = initLucia({ databaseUrl: c.env.DATABASE_URL, environment: c.env.ENVIRONMENT });
  c.set('lucia', lucia);
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

export const dbMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  const db = initDbService(c.env.DATABASE_URL);
  c.set('db', db);
  await next();
});

// trigger.dev requires to manually configure the env vars since process.env is not available in cloudflare workers
export const triggerMiddleware = createMiddleware<HonoOptions>(async (c, next) => {
  configureTriggerClient({
    secretKey: c.env.TRIGGER_API_KEY,
  });
  await next();
});
