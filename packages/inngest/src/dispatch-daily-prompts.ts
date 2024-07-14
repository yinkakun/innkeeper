import OpenAI from 'openai';
import { Resource } from 'sst';
import { inngest } from './client';
import { dbClient } from 'db/client';
import { createDbService } from 'db/service';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Ollama } from '@langchain/community/llms/ollama';

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

const ses = new SESv2Client();
const db = createDbService({ db: dbClient });

const dummyPromptData = {
  userEmail: '',
  prompt: '',
  title: '',
};

const sendEmailCommand = new SendEmailCommand({
  FromEmailAddress: '', // Resource.MyEmail.sender,
  Destination: {
    ToAddresses: [dummyPromptData.userEmail],
  },
  ReplyToAddresses: [''], // [Resource.MyEmail.sender],
  Content: {
    Simple: {
      Body: {
        Text: {
          Data: dummyPromptData.prompt,
        },
      },
      Subject: {
        Data: dummyPromptData.title,
      },
      Headers: [
        {
          Name: 'STRING_VALUE', // required
          Value: 'STRING_VALUE', // required
        },
      ],
    },
  },
});

// const response = await sesClient.send(sendEmailCommand);

// `step.run` creates a new reliable step which retries automatically, and
// only runs once on success.  It returns data which is stored in function
// state automatically.

export const sendDailyPrompts = inngest.createFunction(
  {
    name: 'send-daily-prompts',
    id: 'app/send.daily.prompts',
  },
  {
    cron: '0 * * * *', // every hour
  },
  async ({ step }) => {
    console.log('Generating prompt');
    const currentHourUtc = new Date().getUTCHours();
    const usersToPrompt = await db.getUsersToPromptByHourUTC({ hourUtc: currentHourUtc });

    const prompt = await step.run('Generate Prompt', () => {
      // await generatePrompt(); using open-ai
    });

    await Promise.all([
      step.run('Save Prompt to DB', () => {
        // await savePromptToDb(); using db
      }),
      step.run('send-prompt-to-user', () => {
        // await sendPromptToUser(); using ses
      }),
    ]);

    // return { output, title };
  },
);

//  aws-nuke -c aws-nuke-config.yml --access-key-id AKIAY6A574KFPBYZ76YD --secret-access-key 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
