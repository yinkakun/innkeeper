import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const App = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient({}));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh border bg-stone-50 p-4 pt-4">{children}</div>
    </QueryClientProvider>
  );
};
