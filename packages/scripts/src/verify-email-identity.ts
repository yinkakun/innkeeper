import 'dotenv/config';
import { z } from 'zod';
import { SESv2Client, CreateEmailIdentityCommand } from '@aws-sdk/client-sesv2';

const ConfigSchema = z.object({
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

// yarn verify-email-identity <email1@acme.com>...
const ArgsSchema = z.array(z.string().email()).nonempty();

// script to verify email identity
const main = async () => {
  const config = ConfigSchema.parse({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const ses = new SESv2Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  console.log('argv', process.argv);
  const emails = ArgsSchema.parse(process.argv.slice(2));

  for (const email of emails) {
    const command = new CreateEmailIdentityCommand({
      EmailIdentity: email,
    });
    try {
      const response = await ses.send(command);
      console.log(`email ${email} verification initiated:`, JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(`Error verifying ${email}:`, error);
    }
  }
};

main().catch((error) => {
  console.error('unhandled error:', error);
  process.exit(1);
});
