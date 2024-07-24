import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-[100dvh] flex-col bg-neutral-100')}>
      <header className="absolute left-1/2 top-10 -translate-x-1/2 rounded-[15px] border border-neutral-200 bg-transparent backdrop-blur-lg">
        <nav className="grid grid-cols-3 gap-1 p-0.5">
          <Link to="/journal" className="flex w-full">
            {({ isActive }) => {
              return (
                <span
                  className={cn(
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-neutral-800 hover:text-neutral-900',
                    {
                      'border-neutral-200 bg-neutral-100': isActive,
                    },
                  )}
                >
                  Journal
                </span>
              );
            }}
          </Link>
          <Link to="/insights" className="flex w-full">
            {({ isActive }) => {
              return (
                <span
                  className={cn(
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-neutral-800 hover:text-neutral-900',
                    {
                      'border-neutral-200 bg-neutral-100': isActive,
                    },
                  )}
                >
                  Insights
                </span>
              );
            }}
          </Link>
          <Link to="/settings" className="flex w-full">
            {({ isActive }) => {
              return (
                <span
                  className={cn(
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-neutral-800 hover:text-neutral-900',
                    {
                      'border-neutral-200 bg-neutral-100': isActive,
                    },
                  )}
                >
                  Settings
                </span>
              );
            }}
          </Link>
        </nav>
      </header>

      <main className={cn('mx-auto flex h-full w-full max-w-screen-md grow flex-col px-8 py-5', className)}>
        <div className="flex h-full w-full grow flex-col gap-6 rounded-3xl border border-neutral-200 border-opacity-70 bg-white p-8 pt-20">
          {children}
        </div>
      </main>
    </div>
  );
};

//  <div className="flex flex-col gap-2 rounded-lg border border-neutral-300 border-opacity-50 p-4" key={i}>
//    <span className="text-sm">Date: Saturday August 12th, 2021</span>
//    <span>
//      Prompt Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati provident perspiciatis magni voluptates velit cumque,
//      deleniti voluptate minima consequuntur beatae.
//    </span>
//  </div>;
