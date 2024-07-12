import { z } from 'zod';
import { Inngest, EventSchemas } from 'inngest';

export const inngest = new Inngest({
  id: 'innkeeper',
  eventKey: process.env.INNGEST_EVENT_KEY,
  schemas: new EventSchemas().fromZod({
    'app/journal.entry.created': { data: z.object({ id: z.string() }) },
  }),
});

// TODO: Pause inactive users
// TODO: Add schema to inngest client
// TODO: Rename all workspace packages to start with `@innkeeper/`
// TODO: Add onboarded field to db, create a unpause function in db
// TODO: Add domain to SES tomorrow
// TODO: Install all notboring apps and learn workflow
