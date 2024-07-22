import { createTRPCRouter } from '../trpc';
import { authRouter } from './auth';
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
