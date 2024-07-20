import { createSendEmail, createDb } from '@innkeeper/service';

export const email = createSendEmail({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  fromAddress: process.env.EMAIL_FROM_ADDRESS,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  replyToAddress: process.env.EMAIL_REPLY_TO_ADDRESS,
});

export const db = createDb(process.env.DB_URL);
