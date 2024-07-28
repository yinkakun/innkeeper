import '@/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter, Outlet, createRoute, createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Index } from '@/pages';
import { NotFound } from '@/pages/not-found';
import { Journal } from '@/pages/journal';
import { Insights } from '@/pages/insights';
import { Login } from '@/pages/login';
import { Settings } from '@/pages/settings';
import { Onboarding } from '@/pages/onboarding';
import { PageLoading } from '@/components/page-loading';
import { Toaster } from '@/components/toaster';
import { redirect } from '@tanstack/react-router';
import type { TrpcClient } from '@/lib/trpc';
import { trpc, trpcClient } from '@/lib/trpc';
import { createTRPCQueryUtils } from '@trpc/react-query';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient; trpcClient: TrpcClient }>()({
  component: () => (
    <React.Fragment>
      <Outlet />
      <Toaster />
    </React.Fragment>
  ),
  // errorComponent: NotFound,
  onError: (error) => {
    console.error('error', error);
  },
  notFoundComponent: NotFound,
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
  pendingComponent: () => PageLoading,
  beforeLoad: async ({ context }) => {
    const { queryClient, trpcClient } = context;
    const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient });
    await clientUtils.login.status.fetch().catch((err) => {
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
  getParentRoute: () => rootRoute,
  pendingComponent: () => PageLoading,
  loader: async ({ context }) => {
    const clientUtils = createTRPCQueryUtils({ queryClient: context.queryClient, client: context.trpcClient });
    await clientUtils.journal.entries.ensureData();
  },
  beforeLoad: async ({ context }) => {
    const { queryClient, trpcClient } = context;
    const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient });
    await clientUtils.login.status.fetch().catch((err) => {
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

const insightsRoute = createRoute({
  path: 'insights',
  component: Insights,
  getParentRoute: () => rootRoute,
  pendingComponent: () => PageLoading,
  beforeLoad: async ({ context }) => {
    const { queryClient, trpcClient } = context;
    const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient });
    await clientUtils.login.status.fetch().catch((err) => {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    });
  },
});

const settingsRoute = createRoute({
  path: 'settings',
  component: Settings,
  getParentRoute: () => rootRoute,
  pendingComponent: () => PageLoading,
  loader: async ({ context }) => {
    const client = createTRPCQueryUtils({ queryClient: context.queryClient, client: context.trpcClient });
    await client.user.details.ensureData();
  },
  beforeLoad: async ({ context }) => {
    const { queryClient, trpcClient } = context;
    const client = createTRPCQueryUtils({ queryClient, client: trpcClient });
    await client.login.status.fetch().catch((err) => {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    });
  },
});

const routeTree = rootRoute.addChildren([indexRoute, onboardingRoute, journalRoute, loginRoute, insightsRoute, settingsRoute]);

export const queryClient = new QueryClient({});

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    trpcClient,
    queryClient,
  },
});

//  register route types
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
