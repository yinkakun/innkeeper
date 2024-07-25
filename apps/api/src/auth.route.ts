import { Hono } from 'hono';
import { HonoOptions } from './app';
import { initGoogle } from './auth';
import { decode } from 'hono/jwt';
import { createId } from '@paralleldrive/cuid2';
import { generateIdFromEntropySize } from 'lucia';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { OAuth2RequestError, ArcticFetchError, generateState, generateCodeVerifier } from 'arctic';

export const authRouter = new Hono<HonoOptions>();

authRouter.get('/google', (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const google = initGoogle({
    apiUrl: c.env.API_URL,
    clientId: c.env.GOOGLE_CLIENT_ID,
    clientSecret: c.env.G00GLE_CLIENT_SECRET,
  });
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

authRouter.get('/google/callback', async (c) => {
  const lucia = c.get('lucia');
  const code = c.req.query('code');
  const state = c.req.query('state');

  const google = initGoogle({
    apiUrl: c.env.API_URL,
    clientId: c.env.GOOGLE_CLIENT_ID,
    clientSecret: c.env.G00GLE_CLIENT_SECRET,
  });

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
      throw new HTTPException(500, { message: 'Failed to fetch tokens' });
    }
    throw error;
  });

  if (!tokens) {
    throw new HTTPException(500, { message: 'Failed to fetch tokens' });
  }

  const email = decode(tokens.idToken()).payload.email! as string;
  const existingUser = await c.get('db').getUserByEmail({ email: email });

  if (existingUser) {
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header('Set-Cookie', sessionCookie.serialize(), {
      append: true,
    });
    const onboarded = await c.get('db').isUserOnboarded({ userId: existingUser.id });
    if (onboarded) {
      return c.redirect(`${c.env.APP_URL}/journal`);
    }
    return c.redirect(`${c.env.APP_URL}/onboarding`);
  }

  const user = await c.get('db').createUser({ id: `user_${createId()}`, email });
  if (!user) {
    throw new HTTPException(500, { message: 'Failed to create user' });
  }
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  c.header('Set-Cookie', sessionCookie.serialize(), {
    append: true,
  });
  return c.redirect(`${c.env.APP_URL}/onboarding`);
});
