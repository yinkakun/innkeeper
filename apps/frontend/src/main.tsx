import './main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { Route, Router, RootRoute, NotFoundRoute, RouterProvider } from '@tanstack/react-router';

import { Index } from './pages';
import { NotFound } from './pages/not-found';
import { CreateArticle } from './pages/articles/create';
import { SearchArticles } from './pages/articles/search';

//  create the root route
const rootRoute = new RootRoute();

// create other routes
const indexRoute = new Route({
  path: '/',
  component: Index,
  getParentRoute: () => rootRoute,
});

const createArticleRoute = new Route({
  path: 'articles/create',
  component: CreateArticle,
  getParentRoute: () => rootRoute,
});

const searchArticleRoute = new Route({
  path: 'articles/search',
  component: SearchArticles,
  getParentRoute: () => rootRoute,
});

const notFoundRoute = new NotFoundRoute({
  component: NotFound,
  getParentRoute: () => rootRoute,
});

//  build the route tree
const routeTree = rootRoute.addChildren([indexRoute, createArticleRoute, searchArticleRoute]);

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
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
);
