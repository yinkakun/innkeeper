import { createEmailSender, initDbService } from '@innkeeper/service';

// TODO: use zod to validate the environment variables

export const db = initDbService(process.env.DATABASE_URL);

export const emailSender = createEmailSender({
  provider: 'plunk',
  apiKey: process.env.PLUNK_API_KEY ?? '',
  fromAddress: process.env.EMAIL_FROM_ADDRESS ?? '',
  replyToAddress: process.env.EMAIL_REPLY_TO_ADDRESS ?? '',
});
