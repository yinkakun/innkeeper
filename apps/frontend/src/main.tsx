import './main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './providers';
import { Route, Router, NotFoundRoute, RouterProvider, createRootRoute } from '@tanstack/react-router';

import { Index } from './pages';
import { NotFound } from './pages/not-found';
import { Journal } from './pages/journal';

const rootRoute = createRootRoute();

// create other routes
const indexRoute = new Route({
  path: '/',
  component: Index,
  getParentRoute: () => rootRoute,
});

const journalROute = new Route({
  path: 'journal',
  component: Journal,
  getParentRoute: () => rootRoute,
});

const notFoundRoute = new NotFoundRoute({
  component: NotFound,
  getParentRoute: () => rootRoute,
});

//  build the route tree
const routeTree = rootRoute.addChildren([indexRoute, journalROute]);

const router = new Router({
  routeTree,
});

//  register route types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
