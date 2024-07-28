import { ZodError } from 'zod';
import superjson from 'superjson';
import type { HonoContext } from '@innkeeper/api';
import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createContext = (_options: FetchCreateContextFnOptions, ctx: HonoContext) => {
  ctx.text('🌓🌓🌓🌓');
  return {
    hono: ctx,
    db: ctx.get('db'),
    user: ctx.get('user'),
    lucia: ctx.get('lucia'),
    session: ctx.get('session'),
    sendEmail: ctx.get('sendEmail'),
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

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { session: ctx.session, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
