import { z } from 'zod';
import { Inngest, EventSchemas } from 'inngest';

if (!process.env.INNGEST_EVENT_KEY) {
  throw new Error('INNGEST_EVENT_KEY is required');
}

export const inngest = new Inngest({
  id: 'innkeeper',
  eventKey: process.env.INNGEST_EVENT_KEY,
  schemas: new EventSchemas().fromZod({
    'app/send.prompt': { data: z.object({ id: z.string() }) },
    'app/send.welcome.email': { data: z.object({ email: z.string() }) },
    'app/save.journal.entry': { data: z.object({ entry: z.string(), promptId: z.string() }) },
  }),
});

// Blockers
// - Need to add domain to SES
// - Complete Inngest client schema and setup
// - Rename response table in db to journal entry
// - Add prompt_title, prompt_body, prompt_email_subject to prompt table
// - Add onboarded field to db, and other fields for onboarding
// - Create a unpause function in db
// - Rename all workspace packages to start with `@innkeeper/`
// - Explore all notBoring apps and learn workflow
// - Setup Clerk, read dev.to blog
