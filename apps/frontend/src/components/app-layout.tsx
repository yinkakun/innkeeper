import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { DotPattern } from './dot-pattern';
import { GlobeSimple, User, EnvelopeSimple, GearSix, GearFine } from '@phosphor-icons/react';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-100')}>
      <DotPattern className="z-0 opacity-30" />
      <div className={cn('z-10 mx-auto flex h-full w-full max-w-screen-md grow flex-col px-8 py-5')}>
        <div className="flex h-full w-full grow flex-col gap-6 overflow-hidden rounded-3xl border-0 bg-white p-8 pt-5 shadow-inner shadow-slate-100">
          <Header />
          <main className={cn('flex flex-col overflow-hidden', className)}>{children}</main>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="mx-auto max-w-md rounded-[15px] border border-orange-100 bg-orange-50 bg-opacity-5 backdrop-blur-xl">
      <nav className="grid grid-cols-3 gap-x-1 p-1">
        <Link to="/journal" className="flex w-full">
          {({ isActive }) => {
            return (
              <span
                className={cn(
                  'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-zinc-800 duration-200 hover:bg-orange-50 hover:text-zinc-900',
                  {
                    'border-orange-100 bg-orange-50 bg-opacity-40 backdrop-blur-md': isActive,
                  },
                )}
              >
                <div className="flex items-center gap-2">
                  <EnvelopeSimple
                    size={20}
                    weight="light"
                    className={cn('shrink-0', {
                      'text-orange-500': isActive,
                    })}
                  />
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
                  'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-zinc-800 duration-200 hover:bg-orange-50 hover:text-zinc-900',
                  {
                    'border-orange-100 bg-orange-50 bg-opacity-40 backdrop-blur-md': isActive,
                  },
                )}
              >
                <div className="flex items-center gap-2">
                  <GlobeSimple
                    size={20}
                    weight="light"
                    className={cn('shrink-0', {
                      'text-orange-500': isActive,
                    })}
                  />
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
                  'w-full rounded-[13px] border border-transparent border-opacity-50 bg-transparent px-8 py-1 text-zinc-800 duration-200 hover:bg-orange-50 hover:text-zinc-900',
                  {
                    'border-orange-100 bg-orange-50 bg-opacity-40 backdrop-blur-md': isActive,
                  },
                )}
              >
                <div className="flex shrink-0 items-center gap-2">
                  <GearFine
                    size={20}
                    weight="light"
                    className={cn('shrink-0', {
                      'text-orange-500': isActive,
                    })}
                  />
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
