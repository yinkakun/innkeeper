import superjson from 'superjson';
import type { AppRouter } from '@innkeeper/trpc';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';

const API_URL = import.meta.env.VITE_API_URL;

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: `${API_URL}/trpc`,
    }),
    loggerLink({
      enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
    }),
  ],
});

export type TrpcClient = typeof trpcClient;
