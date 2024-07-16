import { z } from 'zod';
import { Inngest, EventSchemas } from 'inngest';

export const inngest = new Inngest({
  id: 'innkeeper',
  eventKey: 'event_key_placeholder',
  schemas: new EventSchemas().fromZod({
    'app/send.prompt': { data: z.object({ id: z.string() }) },
    'app/send.welcome.email': { data: z.object({ email: z.string() }) },
    'app/save.journal.entry': { data: z.object({ entry: z.string(), promptId: z.string() }) },
  }),
});
