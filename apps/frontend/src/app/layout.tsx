import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';
import '@/styles/globals.css';

import { headers, cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { env } from '@/env.mjs';
import { AppProvider } from '@/app/providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create T3 Turbo',
  description: 'Simple monorepo with shared backend for web & mobile apps',
  openGraph: {
    title: 'Create T3 Turbo',
    description: 'Simple monorepo with shared backend for web & mobile apps',
    url: 'https://create-t3-turbo.vercel.app',
    siteName: 'Create T3 Turbo',
  },
};

export default async function Layout(props: { children: React.ReactNode }) {
  const supabase = createServerComponentClient(
    { cookies },
    { supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  );
  const { data } = await supabase.auth.getSession();

  // if (!data.session) {
  //   redirect("/unauthenticated");
  // }

  return (
    <html lang="en">
      <body className={['font-sans', fontSans.variable].join(' ')}>
        <AppProvider session={data.session} headers={headers()}>
          {props.children}
        </AppProvider>
      </body>
    </html>
  );
}
