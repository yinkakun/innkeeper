import '@/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotFound } from '@/pages/not-found';
import { Index } from '@/pages';
import { Journal } from '@/pages/journal';
import { Insights } from '@/pages/insights';
import { Login } from '@/pages/login';
import { Settings } from '@/pages/settings';
import { Onboarding } from '@/pages/onboarding';
import { Toaster } from '@/components/toaster';
import type { TrpcClient } from '@/lib/trpc';
import { trpc, trpcClient } from '@/lib/trpc';
import { Layout } from '@/components/layout';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { PageLoading } from '@/components/page-loading';
import { createTRPCQueryUtils } from '@trpc/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { TRPCError } from '@trpc/server';
import { RouterProvider, createRouter, Outlet, createRoute, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCClientError } from '@trpc/react-query';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient; trpcClient: TrpcClient }>()({
  component: () => (
    <React.Fragment>
      <Outlet />
      <Toaster richColors closeButton />
    </React.Fragment>
  ),
  onError: (error) => {
    console.error('error', error);
  },
  errorComponent: (error) => (
    <div>
      <h1>Oops! Something went wrong</h1>
      <pre className="text-sm">{JSON.stringify(error, null, 4)}</pre>
    </div>
  ),
  notFoundComponent: NotFound,
  pendingComponent: PageLoading,
});

const indexRoute = createRoute({
  path: '/',
  component: Index,
  getParentRoute: () => rootRoute,
});

const loginRoute = createRoute({
  path: 'login',
  component: Login,
  getParentRoute: () => rootRoute,
});

const onboardingRoute = createRoute({
  path: 'onboarding',
  component: Onboarding,
  getParentRoute: () => rootRoute,
  pendingComponent: PageLoading,
});

const layoutRoute = createRoute({
  id: 'layout',
  component: Layout,
  pendingComponent: PageLoading,
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ context }) => {
    const { queryClient, trpcClient } = context;
    const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient });
    await clientUtils.auth.status.fetch().catch((err) => {
      console.log('err', err);
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    });
  },
});

const journalRoute = createRoute({
  path: 'journal',
  component: Journal,
  getParentRoute: () => layoutRoute,
  pendingComponent: PageLoading,
  loader: async ({ context }) => {
    const clientUtils = createTRPCQueryUtils({ queryClient: context.queryClient, client: context.trpcClient });
    await clientUtils.journal.getPrompts.ensureData();
  },
});

const insightsRoute = createRoute({
  path: 'insights',
  component: Insights,
  getParentRoute: () => layoutRoute,
  pendingComponent: PageLoading,
  loader: async ({ context }) => {
    const clientUtils = createTRPCQueryUtils({ queryClient: context.queryClient, client: context.trpcClient });
    await clientUtils.user.details.ensureData();
  },
});

const settingsRoute = createRoute({
  path: 'settings',
  component: Settings,
  getParentRoute: () => layoutRoute,
  pendingComponent: PageLoading,
  loader: async ({ context }) => {
    const client = createTRPCQueryUtils({ queryClient: context.queryClient, client: context.trpcClient });
    await client.user.details.ensureData();
  },
});

const routeTree = rootRoute.addChildren([indexRoute, layoutRoute, onboardingRoute, journalRoute, loginRoute, insightsRoute, settingsRoute]);

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPendingMinMs: 0,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    trpcClient,
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const $root = document.getElementById('root');
if ($root && !$root.innerHTML) {
  const root = ReactDOM.createRoot($root);
  root.render(
    <React.StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>,
  );
}
