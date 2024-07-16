import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default {
  fetch: app.fetch,
  email: async (message, env, ctx) => {
    console.log('Incoming)', env);
  },
} satisfies ExportedHandler<Env>;
