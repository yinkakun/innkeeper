import type { z } from 'zod';
import { Chance } from 'chance';
import { usersTable } from './schema';
import type { DbClient } from './client';
import { createDbService } from './service';
import type { CreateUserSchema, CreatePromptSchema, CreateJournalEntrySchema, UserSchema } from '@innkeeper/db/schema';

import { Database } from '@libsql/sqlite3';
import { drizzle } from 'drizzle-orm/libsql';

const chance = new Chance();
const dbClient: DbClient = drizzle(new Database('sqlite.db'));

const db = createDbService({ db: dbClient });

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
  await dbClient.delete(usersTable);

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
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
