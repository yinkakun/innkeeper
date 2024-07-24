import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-[100dvh] flex-col bg-neutral-50')}>
      <header className="absolute left-1/2 top-5 -translate-x-1/2 rounded-[15px] border border-neutral-200 bg-transparent backdrop-blur-lg">
        <nav className="grid grid-cols-3 gap-1 p-0.5">
          <Link to="/journal" className="flex w-full">
            {({ isActive }) => {
              return (
                <span
                  className={cn(
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-2 text-neutral-800 hover:text-neutral-900',
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
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-2 text-neutral-800 hover:text-neutral-900',
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
                    'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-2 text-neutral-800 hover:text-neutral-900',
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

      <main className={cn('mx-auto h-full w-full max-w-screen-2xl grow px-4 pb-10 pt-10', className)}>{children}</main>
    </div>
  );
};
