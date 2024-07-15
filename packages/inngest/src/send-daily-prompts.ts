import { inngest } from './client';
import { dbClient } from '@innkeeper/db/client';
import { createDbService } from '@innkeeper/db/service';
import { Ollama } from '@langchain/community/llms/ollama';
import type { GetEvents } from 'inngest';

type InngestEvents = GetEvents<typeof inngest>;

import { ChatAnthropic } from '@langchain/anthropic';

// const ollama = new Ollama({
//   baseUrl: 'http://localhost:11434', // Default value
//   model: 'llama2', // Default value
// });

// const model = new ChatAnthropic({
//   model: 'claude-3-sonnet-20240229',
//   temperature: 0,
// });

// const llm = new OpenAI({
//   apiKey: '',
//   baseURL: 'xxx',
// });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sesv2/command/SendEmailCommand/
// https://logsnag.com/blog/handling-timezones-in-javascript-with-date-fns-tz
// https://github.com/batuhanbilginn/background-jobs-nextjs13-inngest/blob/main/app/api/inngest/route.ts

const db = createDbService({ db: dbClient });

const DUMMY_DATA = {
  title: 'Dummy Prompt Title',
  prompt: 'This is a dummy prompt.',
  userEmail: 'dryinkuzz@gmail.com',
};

// get users to prompt and dispatch send prompt events
export const dailyPromptsCron = inngest.createFunction(
  {
    id: 'dispatch-daily-prompts',
    name: 'Dispatch Daily Prompts',
  },
  {
    cron: '0 * * * *', // every hour
  },
  async ({ step }) => {
    console.log('Getting users to prompt');
    const currentHourUtc = new Date().getUTCHours();

    // Get users to prompt based on current hour
    const usersToPrompt = await step.run('get-users-to-prompt', async () => {
      return db.getUsersToPromptByHourUTC({ hourUtc: currentHourUtc });
    });

    if (!usersToPrompt.length) {
      return {
        success: true,
        message: 'No users to prompt',
      };
    }

    // Send prompts to users
    const events = usersToPrompt.map<InngestEvents['app/send.prompt']>((user) => ({
      name: 'app/send.prompt',
      data: { id: user.id },
      user,
    }));

    console.log('Sending prompts');
    await step.sendEvent('dispatch-send-prompt-events', events);

    return {
      success: true,
      message: `${usersToPrompt.length} prompts sent`,
    };
  },
);

export const sendPrompt = inngest.createFunction(
  {
    name: 'Send Prompt',
    id: 'send-prompt',
  },
  {
    event: 'app/send.prompt',
  },
  async ({ step, event }) => {
    console.log('Sending prompt');
    const { id } = event.data;
    // receive user email, user goals

    // fetch user time zone, preferences for personalization, etc
    const user = await step.run('get-user', () => {
      // await fetchUser({ id });
    });

    // generate prompt
    const prompt = await step.run('generate-prompt', () => {
      //  await generatePrompt(); using open-ai
    });

    // generate prompt email subject based on prompt
    const emailSubject = await step.run('generate-email-subject', () => {
      // await generateEmailSubject({ prompt });
    });

    // send prompt to user and save to db
    await Promise.all([
      step.run('save-prompt-to-db', () => {
        // await savePromptToDb(); using db
      }),
      step.run('send-prompt-to-user', async () => {
        // await sendPromptToUser({ prompt, emailSubject, user });
      }),
    ]);

    return {
      success: true,
      message: `Prompt sent`,
    };
  },
);
