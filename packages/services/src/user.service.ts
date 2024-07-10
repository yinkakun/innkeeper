import type { z } from 'zod';
import { db } from 'db/client';
import type { CreateUsersSchema, UpdateUserSchema } from 'db/schema';
import { usersTable } from 'db/schema';
import { between, eq, and } from 'drizzle-orm';

export const createUserService = <T extends typeof db>({ db }: { db: T }) => {
  return {
    async createUser({ id, name, email, preferredHourUTC, timezone }: z.infer<typeof CreateUsersSchema>) {
      return db.insert(usersTable).values({ id, name, email, preferredHourUTC, timezone }).returning();
    },

    async pauseUser({ userId }: { userId: string }) {
      return db.update(usersTable).set({ isPaused: true }).where(eq(usersTable.id, userId)).returning();
    },

    async deleteUser({ userId }: { userId: string }) {
      return db.update(usersTable).set({ isDeleted: true }).where(eq(usersTable.id, userId)).returning();
    },

    async updateUser({ id, name, email, preferredHourUTC, timezone }: z.infer<typeof UpdateUserSchema>) {
      return db.update(usersTable).set({ name, email, preferredHourUTC, timezone }).where(eq(usersTable.id, id)).returning();
    },

    async getUserById({ userId }: { userId: string }) {
      return db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
      });
    },

    async getUserByEmail({ email }: { email: string }) {
      return db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });
    },

    async getUserByPromptId({ promptId }: { promptId: string }) {
      return db.query.promptsTable.findFirst({
        columns: {},
        where: (prompt, { eq }) => eq(prompt.id, promptId),
        with: {
          user: true,
        },
      });
    },

    async getUsersByPreferredHourUTC({ preferredHourUTC }: { preferredHourUTC: number }) {
      return db.query.usersTable.findMany({
        where: and(eq(usersTable.preferredHourUTC, preferredHourUTC), eq(usersTable.isPaused, false), eq(usersTable.isDeleted, false)),
      });
    },

    async getUsersByLastResponseAt({ days, isDeleted = false }: { days: number; isDeleted?: boolean }) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      return db.query.usersTable.findMany({
        where: and(between(usersTable.lastResponseAt, start, now), eq(usersTable.isPaused, isDeleted)),
      });
    },
  };
};

export const userService = createUserService({ db });
