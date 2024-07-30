import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { GlobeSimple, UserCircle, EnvelopeSimple } from '@phosphor-icons/react';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-[100dvh] flex-col overflow-hidden bg-gray-50')}>
      <Header />
      <main
        className={cn(
          'mx-auto mt-8 flex h-full w-full max-w-screen-md grow flex-col rounded-t-3xl border border-gray-200 bg-white px-6 pb-4 pt-12',
        )}
      >
        {/* <div className="flex h-full w-full grow flex-col gap-6 rounded-3xl bg-white p-8 pt-5"> */}
        <div className={cn('flex flex-col', className)}>{children}</div>
        {/* </div> */}
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-4 z-20 mx-auto max-w-md rounded-[18px] border border-gray-200 bg-gray-50 bg-opacity-50 backdrop-blur-sm">
      <nav className="grid grid-cols-3 gap-x-2 p-1">
        {LINKS.map(({ title, slug, icon: Icon }) => {
          return (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={title} className="gap -1 flex flex-col items-center">
              <Link to={slug} className="flex w-full">
                {({ isActive }) => {
                  return (
                    <span
                      className={cn(
                        'group w-full rounded-[13px] border border-transparent bg-transparent px-8 py-1 text-gray-700 duration-200 hover:bg-orange-50',
                        {
                          'bg-orange-50 text-gray-800': isActive,
                        },
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          size={20}
                          weight="light"
                          className={cn('shrink-0 duration-200 group-hover:text-orange-500', {
                            'text-orange-500': isActive,
                          })}
                        />
                        <span
                          className={cn('shrink-0 text-sm', {
                            'text-gray-600': isActive,
                          })}
                        >
                          {title}
                        </span>
                      </div>
                    </span>
                  );
                }}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </header>
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
