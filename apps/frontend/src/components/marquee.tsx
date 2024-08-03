import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  repeat?: number;
  reverse?: boolean;
  className?: string;
  vertical?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
}

export const Marquee: React.FC<MarqueeProps> = ({
  reverse,
  children,
  className,
  repeat = 4,
  vertical = false,
  pauseOnHover = false,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
};
