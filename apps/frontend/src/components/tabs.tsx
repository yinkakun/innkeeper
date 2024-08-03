import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface Tab {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
}

interface TabsProps {
  tabs: Tab[];
  tabClassName?: string;
  containerClassName?: string;
  activeTabClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, containerClassName, activeTabClassName, tabClassName }) => {
  const [active, setActive] = useState<Tab | undefined>(tabs[0]);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...tabs];
    const selectedTab = newTabs.splice(idx, 1);
    if (!selectedTab[0]) {
      return null;
    }
    setActive(newTabs[0]);
    newTabs.unshift(selectedTab[0]);
  };

  return (
    <div
      className={cn(
        'no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible',
        containerClassName,
      )}
    >
      {tabs.map((tab, idx) => (
        <button
          key={tab.title}
          onClick={() => {
            moveSelectedTabToTop(idx);
          }}
          className={cn('relative rounded-full px-4 py-2', tabClassName)}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {active?.value === tab.value && (
            <motion.div
              layoutId="clickedButton"
              transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              className={cn('absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800', activeTabClassName)}
            />
          )}

          <span className="relative block text-black dark:text-white">{tab.title}</span>
        </button>
      ))}
    </div>
  );
};
