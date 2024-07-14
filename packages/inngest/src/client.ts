import { z } from 'zod';
import { Inngest, EventSchemas } from 'inngest';

export const inngest = new Inngest({
  id: 'innkeeper',
  eventKey: process.env.INNGEST_EVENT_KEY,
  schemas: new EventSchemas().fromZod({
    'app/journal.entry.created': { data: z.object({ id: z.string() }) },
  }),
});

// Blockers
// - Need to add domain to SES
// - Complete Inngest client schema and setup
// - Rename response table in db to journal entry
// - Add onboarded field to db, and other fields for onboarding
// - Create a unpause function in db
// - Rename all workspace packages to start with `@innkeeper/`
// - Explore all notBoring apps and learn workflow
// - Setup Clerk, read dev.to blog
