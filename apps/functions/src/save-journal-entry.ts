import { z } from 'zod';
import { dbClient } from 'db/client';
import { createDbService } from 'db/service';
import type { SQSHandler } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client();
const db = createDbService({ db: dbClient });

const promptId = 'promptId';
const emailContent = 'emailContent';

// https://blog.serverlesscnd.com/zod-lambda-validation/
// https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-lambda-example-functions.html

console.log('SaveJournalEntry handler');

export const handler: SQSHandler = async (event) => {
  console.log(`Received event from SQS: ${JSON.stringify(event)}`);

  // const user = await db.getUserByPromptId({ promptId });
  // if (!user) {
  //   throw new Error('User not found');
  // }

  // await db.createResponse({ response: emailContent, promptId, userId: user.user.id });
  // return;
  return;
};
