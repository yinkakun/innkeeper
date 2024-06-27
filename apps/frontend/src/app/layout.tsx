import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

import { headers } from 'next/headers';

// import { env } from '@/env.mjs';
import { AppProvider } from '@/app/providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Turbo Starter',
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={['font-sans', fontSans.variable].join(' ')}>
        <AppProvider headers={headers()}>{props.children}</AppProvider>
      </body>
    </html>
  );
}
