import OpenAI from 'openai';
import { inngest } from './client';
import { Ollama } from '@langchain/community/llms/ollama';
import { createDb } from '@innkeeper/db';
import { create } from 'domain';

const db = createDb('');

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
      // await sendWeeklyInsights({});
    });
  },
);
