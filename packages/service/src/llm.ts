// import { Ollama } from '@langchain/community/llms/ollama';
// import { ChatAnthropic } from '@langchain/anthropic';

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

export const llm = {
  generateInsights: async (payload: { userId: string }) => {
    // TODO: generate insights for the user
    return 'Insights';
  },
  generatePrompt: async (payload: { userId: string }) => {
    // TODO: generate prompt for the user
    return 'Prompt';
  },
};
