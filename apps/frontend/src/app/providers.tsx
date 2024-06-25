'use client';

import React from 'react';
import superjson from 'superjson';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { env } from '@/env.mjs';
import { TRPCReact } from '@/utils/api';

interface AppProviderProps {
  headers?: Headers;
  session?: Session | null;
  children: React.ReactNode;
}

export function AppProvider(props: AppProviderProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = React.useState(() =>
    TRPCReact.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
          headers() {
            const headers = new Map(props.headers);
            headers.set('x-trpc-source', 'nextjs');
            headers.set('authorization', `Bearer ${props.session?.access_token}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <TRPCReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration transformer={superjson}>{props.children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </TRPCReact.Provider>
  );
}
