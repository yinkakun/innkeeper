import Anthropic from '@anthropic-ai/sdk';
import { initDbRepository } from '@innkeeper/db';
import { initEmailSender, initLlm } from '@innkeeper/services';

// TODO: use zod to validate the environment variables
export const db = initDbRepository(process.env.DATABASE_URL);

export const email = initEmailSender({
  provider: 'plunk',
  apiKey: process.env.PLUNK_API_KEY ?? '',
  emailDomain: process.env.EMAIL_DOMAIN ?? '',
});

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const llm = initLlm(anthropic);
