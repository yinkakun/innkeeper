import { initDbRepository } from '@innkeeper/db';
import { initEmailSender } from '@innkeeper/services';

// TODO: use zod to validate the environment variables
export const db = initDbRepository(process.env.DATABASE_URL);

export const sendEmail = initEmailSender({
  provider: 'plunk',
  apiKey: process.env.PLUNK_API_KEY ?? '',
  emailDomain: process.env.EMAIL_DOMAIN ?? '',
});
