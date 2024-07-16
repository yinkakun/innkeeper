import { inngest } from './client';
import { dbClient } from '@package/db/client';
import { createDbService } from '@package/db/service';

const DUMMY_DATA = {
  title: 'Dummy Prompt Title',
  prompt: 'This is a dummy prompt.',
  userEmail: 'dryinkuzz@gmail.com',
};

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
      // await sendWelcomeEmail({
      //   email: user.email,
      // });
    });

    return {
      success: true,
      message: `Welcome email sent to ${DUMMY_DATA.userEmail}`,
    };
  },
);
