import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { DotPattern } from './dot-pattern';
import { GlobeSimple, User, EnvelopeSimple } from '@phosphor-icons/react';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-[100dvh] flex-col overflow-hidden bg-neutral-100')}>
      <DotPattern className="z-0 opacity-30" />
      <div className={cn('z-10 mx-auto flex h-full w-full max-w-screen-md grow flex-col px-8 py-5')}>
        <div className="flex h-full w-full grow flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-8 pt-5 shadow-md shadow-slate-100">
          <Header />
          <main className={cn('flex flex-col overflow-hidden', className)}>{children}</main>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="mx-auto max-w-md rounded-[15px] border border-neutral-200 bg-white backdrop-blur-lg">
      <nav className="grid grid-cols-3 gap-x-1 p-0.5">
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
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={20} weight="light" />
                  <span className="text-sm">Journal</span>
                </div>
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
                <div className="flex items-center gap-2">
                  <GlobeSimple size={20} weight="light" />
                  <span className="text-sm">Insights</span>
                </div>
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
                <div className="flex shrink-0 items-center gap-2">
                  <User size={24} weight="light" />
                  <span className="text-sm">Settings</span>
                </div>
              </span>
            );
          }}
        </Link>
      </nav>
    </header>
  );
};
