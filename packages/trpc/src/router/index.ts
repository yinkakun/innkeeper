import { createTRPCRouter } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';
import { journalRouter } from './journal';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  journal: journalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
