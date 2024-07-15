// import { serve } from 'inngest/lambda';
// import {
//   inngest,
//   sendPrompt,
//   dailyPromptsCron,
//   saveJournalEntry,
//   sendWelcomeEmail,
//   sendWeeklyInsightsCron,
//   pauseInactiveUsersCron,
// } from '@innkeeper/inngest';

// console.log('Inngest handler', inngest);

// export const handler = serve({
//   client: inngest,
//   baseUrl: process.env.INNGEST_BASE_URL,
//   functions: [dailyPromptsCron, sendPrompt, pauseInactiveUsersCron, sendWeeklyInsightsCron, sendWelcomeEmail, saveJournalEntry],
// });
