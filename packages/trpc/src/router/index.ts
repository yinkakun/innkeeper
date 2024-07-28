import { createTRPCRouter } from '../trpc';
import { authRouter } from './auth';
import { userRouter } from './user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  login: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
