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
