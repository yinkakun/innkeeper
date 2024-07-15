import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
// import { appRouter, createContext } from 'trpc';

const app = new Hono();

export default app;
