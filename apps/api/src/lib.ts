import { Lucia } from 'lucia';
import { Google } from 'arctic';
import { initLuciaDbAdapter } from '@innkeeper/db';

interface initGoogle {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
}

export const initGoogle = ({ clientId, clientSecret, apiUrl }: initGoogle) => {
  return new Google(clientId, clientSecret, `${apiUrl}/auth/google/callback`);
};

export const initLucia = ({ databaseUrl, environment }: { databaseUrl: string; environment?: string }) => {
  const db = initLuciaDbAdapter(databaseUrl);
  return new Lucia(db, {
    sessionCookie: {
      attributes: {
        secure: environment !== 'development',
      },
    },
    getUserAttributes: (attributes) => ({
      email: attributes.email,
    }),
  });
};

interface DatabaseUserAttributes {
  email: string;
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
