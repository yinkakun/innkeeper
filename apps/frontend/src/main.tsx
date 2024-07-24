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

import type { TrpcClient } from '@/lib/trpc';
import { trpc, trpcClient } from '@/lib/trpc';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient; trpcClient: TrpcClient }>()({
  component: () => (
    <React.Fragment>
      <Outlet />
      {/* <ReactQueryDevtools /> */}
      {/* <TanStackRouterDevtools  /> */}
    </React.Fragment>
  ),

  notFoundComponent: NotFound,
});

// create other routes
const indexRoute = createRoute({
  path: '/',
  component: Index,
  getParentRoute: () => rootRoute,
});

const onboardingRoute = createRoute({
  path: 'onboarding',
  component: Onboarding,
  getParentRoute: () => rootRoute,
});

const journalRoute = createRoute({
  path: 'journal',
  component: Journal,
  getParentRoute: () => rootRoute,
});

const insightsRoute = createRoute({
  path: 'insights',
  component: Insights,
  getParentRoute: () => rootRoute,
});

const settingsRoute = createRoute({
  path: 'settings',
  component: Settings,
  getParentRoute: () => rootRoute,
});

const loginRoute = createRoute({
  path: 'login',
  component: Login,
  getParentRoute: () => rootRoute,
});

//  build the route tree
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

console.log('root', $root);

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
