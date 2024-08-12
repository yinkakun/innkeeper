import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { type Icon } from '@phosphor-icons/react';

interface Link {
  icon: Icon;
  slug: string;
  title: string;
}

interface Props {
  links: Link[];
}

export const Nav: React.FC<Props> = ({ links }) => {
  return (
    <nav
      className={cn(
        'no-visible-scrollbar relative grid w-full max-w-full grid-cols-3 overflow-auto p-0.5 [perspective:1000px] sm:overflow-visible',
      )}
    >
      {links.map(({ icon: Icon, slug, title }) => (
        <motion.div key={slug} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <Link
            to={slug}
            className={cn(
              'group relative z-10 inline-block w-full rounded-full border border-transparent px-4 py-1 duration-200 hover:bg-orange-50',
            )}
          >
            {({ isActive }) => {
              return (
                <div>
                  {isActive && (
                    <motion.div
                      layoutId="clicked"
                      transition={{ duration: 0.6, ease: 'easeOut' }}
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
  );
};
