import { Resource } from 'sst';
import { inngest } from './client';
import { dbClient } from 'db/client';
import { createDbService } from 'db/service';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const DUMMY_DATA = {
  title: 'Dummy Prompt Title',
  prompt: 'This is a dummy prompt.',
  userEmail: 'dryinkuzz@gmail.com',
};

const ses = new SESv2Client();
const db = createDbService({ db: dbClient });

export const sendWelcomeEmail = inngest.createFunction(
  {
    name: 'Send Welcome Email',
    id: 'send-welcome-email',
  },
  {
    event: 'app/send.welcome.email',
  },
  async ({ event: _, step }) => {
    console.log('Sending Welcome Email');

    // const user = await step.run('get-user', async () => {
    //   return db.getUserByEmail({ email });
    // });

    // if (!user) {
    //   return {
    //     success: false,
    //     message: 'User not found',
    //   };
    // }

    // Send welcome email
    await step.run('send-welcome-email', async () => {
      const command = new SendEmailCommand({
        FromEmailAddress: 'innkeeper@studiolefleur.com', // Resource.MyEmail.sender,
        Destination: {
          ToAddresses: [DUMMY_DATA.userEmail],
        },
        ReplyToAddresses: ['innkeeper@studiolefleur.com'], // [Resource.MyEmail.sender],
        Content: {
          Simple: {
            Subject: { Data: 'Welcome to Innkeeper' },
            Body: { Text: { Data: 'Welcome to Innkeeper' } },
            Headers: [
              {
                Name: 'x-user-id',
                Value: 'user_xxxxxxxxx',
              },
            ],
          },
        },
      });

      await ses.send(command);
    });

    return {
      success: true,
      message: `Welcome email sent to ${DUMMY_DATA.userEmail}`,
    };
  },
);
