import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { DotPattern } from './dot-pattern';
import { Outlet } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { GlobeSimple, UserCircle, EnvelopeSimple } from '@phosphor-icons/react';
import { useLocation } from '@tanstack/react-router';
export const Layout = () => {
  const { pathname } = useLocation();
  return (
    <div className={cn('flex min-h-[100dvh] basis-0 flex-col overflow-y-auto bg-gray-50')}>
      <header className="fixed inset-x-0 top-4 z-20 mx-auto flex max-w-md items-center rounded-full border border-gray-200 bg-gray-50 bg-opacity-50 p-0 backdrop-blur-sm">
        <nav
          className={cn(
            'no-visible-scrollbar relative grid w-full max-w-full grid-cols-3 overflow-auto p-0.5 [perspective:1000px] sm:overflow-visible',
          )}
        >
          {LINKS.map(({ icon: Icon, slug, title }) => (
            <motion.div key={slug} whileTap={{ scale: 0.9 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              <Link
                to={slug}
                className={cn(
                  'group relative z-10 inline-block w-full rounded-full border border-transparent px-4 py-2 duration-200 hover:bg-orange-50',
                )}
              >
                {({ isActive }) => {
                  return (
                    <div>
                      {isActive && (
                        <motion.div
                          layoutId="clicked"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={cn('absolute inset-0 w-full rounded-full border border-orange-300 bg-orange-50')}
                        />
                      )}

                      <div className="relative flex w-full items-center justify-center gap-2 text-sm">
                        <Icon
                          size={20}
                          weight="light"
                          className={cn('duration-200 group-hover:text-orange-500', {
                            'text-orange-500': isActive,
                          })}
                        />
                        <span className="relative z-10">{title}</span>
                      </div>
                    </div>
                  );
                }}
              </Link>
            </motion.div>
          ))}
        </nav>
      </header>
      <DotPattern className="fixed inset-0" />
      <main
        className={cn(
          'z-10 mx-auto mt-8 flex h-full w-full max-w-screen-md grow basis-0 flex-col rounded-t-3xl border border-gray-200 bg-white px-6 pb-4 pt-12',
        )}
      >
        <motion.div
          key={pathname}
          initial={{
            scale: 1.1,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            ease: 'easeIn',
            duration: 0.3,
          }}
        >
          <div className={cn('flex h-full grow basis-0 flex-col pb-4')}>
            <Outlet />
          </div>
        </motion.div>
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
