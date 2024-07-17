import { ZodError } from 'zod';
import superjson from 'superjson';
import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { HonoContext } from '@innkeeper/api';

export const createContext = async (options: FetchCreateContextFnOptions, ctx: HonoContext) => {
  return {
    db: ctx.get('db'),
    configureTriggerClient: ctx.get('configureTriggerClient'),
    session: {
      id: 'session-id',
    },
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
