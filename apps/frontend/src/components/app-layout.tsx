import { Nav } from './nav';
import { cn } from '@/lib/utils';
import { DotPattern } from './dot-pattern';
import { Outlet } from '@tanstack/react-router';
import { GlobeSimple, UserCircle, EnvelopeSimple } from '@phosphor-icons/react';

export const AppLayout = () => {
  return (
    <div className={cn('flex min-h-[100dvh] basis-0 flex-col overflow-y-auto bg-gray-50')}>
      <header className="fixed inset-x-0 top-4 z-20 mx-auto flex max-w-md items-center rounded-full border border-gray-200 bg-gray-50 bg-opacity-50 p-0 backdrop-blur-sm">
        <Nav links={LINKS} key="header" />
      </header>
      <DotPattern className="fixed inset-0" />
      <main
        className={cn(
          'z-10 mx-auto mt-8 flex h-full w-full max-w-screen-md grow basis-0 flex-col rounded-t-3xl border border-gray-200 bg-white px-6 pb-4 pt-12',
        )}
      >
        <div className={cn('flex h-full grow basis-0 flex-col pb-4')}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const LINKS = [
  {
    title: 'Journal',
    slug: '/journal',
    icon: EnvelopeSimple,
  },
  {
    title: 'Insights',
    slug: '/insights',
    icon: GlobeSimple,
  },
  {
    title: 'Profile',
    slug: '/settings',
    icon: UserCircle,
  },
];
