'use client';

import React from 'react';
import superjson from 'superjson';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from 'trpc';

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
    },
  });
};

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const trpcAPI = createTRPCReact<AppRouter>();

interface AppProviderProps {
  headers?: Headers;
  children: React.ReactNode;
}

export function AppProvider(props: AppProviderProps) {
  const queryClient = getQueryClient();

  const [trpcClient] = React.useState(() =>
    trpcAPI.createClient({
      links: [
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: superjson,
          url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
          headers() {
            const headers = new Map(props.headers);
            headers.set('x-trpc-source', 'nextjs');
            headers.set('authorization', `Bearer ${''}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpcAPI.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </trpcAPI.Provider>
    </QueryClientProvider>
  );
}
