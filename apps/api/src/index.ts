import { appRouter, createTRPCContext } from 'trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export default {
  async fetch(request: Request): Promise<Response> {
    // handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      });
    }

    const response = await fetchRequestHandler({
      req: request,
      endpoint: '/trpc',
      router: appRouter,
      createContext: createTRPCContext,
      onError({ error, path }) {
        console.error(`>>>>>> tRPC Error on '${path}'`, error);
      },
    });

    const corsResponse = new Response(response.body, response);

    // Add CORS headers
    corsResponse.headers.set('Access-Control-Allow-Origin', '*');
    corsResponse.headers.set('Access-Control-Allow-Headers', '*');
    corsResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    return corsResponse;
  },
};
