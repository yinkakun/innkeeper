import 'dotenv/config';
import { z } from 'zod';
import { Chance } from 'chance';
import postgres from 'postgres';
import { initDbService } from '@innkeeper/service';
import { drizzle } from 'drizzle-orm/postgres-js';
import { usersTable, schema } from '@innkeeper/db';
import type { CreatePromptSchema, CreateJournalEntrySchema, UserSchema } from '@innkeeper/db';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const chance = new Chance();
const db = initDbService(DATABASE_URL);
const client = postgres(DATABASE_URL, { prepare: false });

const CreateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  timezone: z.string(),
  promptHourUTC: z.number(),
});

const createUser = async () => {
  const userData: z.infer<typeof CreateUserSchema> = {
    id: chance.guid(),
    name: chance.name(),
    email: chance.email(),
    timezone: chance.timezone().abbr,
    promptHourUTC: chance.integer({ min: 0, max: 23 }),
  };
  return await db.createUser(userData);
};

const seedUsers = async (count: number) => {
  return (await Promise.all(Array.from({ length: count }, createUser))).filter((user) => !!user);
};

const seedPrompt = async (userId: string) => {
  const promptData: z.infer<typeof CreatePromptSchema> = {
    userId,
    body: chance.paragraph(),
    title: chance.sentence(),
  };
  return await db.createPrompt(promptData);
};

const seedJournalEntry = async (user: z.infer<typeof UserSchema>) => {
  const prompt = await seedPrompt(user.id).catch((error) => {
    console.error(`Failed to create prompt for user ${user.id}:`, error);
    return null;
  });

  if (!prompt) return null;

  const journalEntryData: z.infer<typeof CreateJournalEntrySchema> = {
    userId: user.id,
    promptId: prompt.id,
    entry: chance.paragraph(),
  };

  const journalEntry = await db.createJournalEntry(journalEntryData).catch((error) => {
    console.error(`Failed to create journalEntry for user ${user.id}:`, error);
    return null;
  });

  if (!journalEntry) return null;

  return { prompt, journalEntry };
};

const seedJournalEntries = async (users: z.infer<typeof UserSchema>[], count: number) => {
  const entriesPromises = users.flatMap((user) => Array.from({ length: count }, () => seedJournalEntry(user)));
  return (await Promise.all(entriesPromises)).filter((entry) => !!entry);
};

async function seed() {
  console.log('Starting seeding...');
  await drizzle(client, { schema: schema }).delete(usersTable);

  const users = await seedUsers(10).catch((error) => {
    console.error('Failed to seed users:', error);
    return null;
  });

  if (!users) return;

  console.log(`${users.length} users seeded successfully`);

  const journalEntries = await seedJournalEntries(users, 20).catch((error) => {
    console.error('Failed to seed journal entries:', error);
    return null;
  });

  if (!journalEntries) return;

  console.log(`${journalEntries.length} journal entries seeded successfully`);
}

seed()
  .then(() => {
    console.info('Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
