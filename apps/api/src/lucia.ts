import { Lucia } from 'lucia';
import { Google } from 'arctic';
import { initLuciaDbAdapter } from '@innkeeper/service';

interface initGoogle {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export const initGoogle = ({ clientId, clientSecret, redirectUri }: initGoogle) => {
  return new Google(clientId, clientSecret, redirectUri);
};

export const initLucia = ({ databaseUrl, secure }: { databaseUrl: string; secure?: boolean }) => {
  const db = initLuciaDbAdapter(databaseUrl);
  return new Lucia(db, {
    sessionCookie: {
      attributes: {
        secure: secure ?? false, // set to `true` when using HTTPS
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
