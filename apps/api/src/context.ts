import type { Context } from 'hono';
import type { User, Session, Lucia } from 'lucia';
import type { initDbRepository } from '@innkeeper/db';
import type { initEmailSender } from '@innkeeper/services';

interface Variables {
  lucia: Lucia;
  user: User | null;
  session: Session | null;
  db: ReturnType<typeof initDbRepository>;
  sendEmail: ReturnType<typeof initEmailSender>;
}

export interface Bindings {
  API_URL: string;
  APP_URL: string;
  ENVIRONMENT: string;
  DATABASE_URL: string;
  TRIGGER_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  PLUNK_API_KEY: string;
  EMAIL_DOMAIN: string; // example.com
  G00GLE_CLIENT_SECRET: string;
}

export interface HonoOptions {
  Bindings: Bindings;
  Variables: Variables;
}

export type HonoContext = Context<HonoOptions>;
