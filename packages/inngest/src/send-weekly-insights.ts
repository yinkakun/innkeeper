import OpenAI from 'openai';
import { Resource } from 'sst';
import { inngest } from './client';
import { dbClient } from 'db/client';
import { createDbService } from 'db/service';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { Ollama } from '@langchain/community/llms/ollama';

const ses = new SESv2Client();
const db = createDbService({ db: dbClient });

const DUMMY_DATA = {
  title: 'Dummy Prompt Title',
  prompt: 'This is a dummy prompt.',
  userEmail: 'dryinkuzz@gmail.com',
};

export const sendWeeklyInsightsCron = inngest.createFunction(
  {
    id: 'send-weekly-insights',
    name: 'Send Weekly Insights',
  },
  {
    cron: '0 0 * * 0', // every Sunday
  },
  async ({ step }) => {
    console.log('Sending Weekly Insights');

    // get last week's journal entries and prompts
    const recentJournalEntries = await step.run('Get Recent Journal Entries', async () => {
      // return db.getRecentJournalEntries();
    });

    // use OpenAI to generate insights
    const generatedInsights = await step.run('Generate Insights', async () => {
      // return llm.generateInsights({
      //   journalEntries: recentJournalEntries,
      // });
    });

    await step.run('send-weekly-insights', async () => {
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
  },
);
