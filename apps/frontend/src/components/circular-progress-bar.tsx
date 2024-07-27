import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  min?: number;
  max?: number;
  size?: Size;
  value: number;
  className?: string;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
}

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const SIZE_TO_PX: Record<Size, number> = {
  xs: 40,
  sm: 60,
  md: 110,
  lg: 150,
  xl: 180,
  '2xl': 200,
  '3xl': 220,
};

export const CircularProgressBar: React.FC<Props> = ({
  value = 0,
  size = 'md',
  className,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  min = 0,
  max = 100,
}) => {
  const sizeInPx = SIZE_TO_PX[size];
  const strokeWidth = sizeInPx * 0.1; // 10% of size for stroke width
  const radius = (sizeInPx - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentPx = circumference / 100;
  const currentPercent = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div
      className={cn('relative font-semibold', className)}
      style={
        {
          width: `${sizeInPx}px`,
          height: `${sizeInPx}px`,
          fontSize: `${sizeInPx * 0.2}px`, // 20% of size for font size
          '--circle-size': `${sizeInPx}px`,
          '--circumference': circumference,
          '--percent-to-px': `${percentPx}px`,
          '--gap-percent': '5',
          '--offset-factor': '0',
          '--transition-length': '1s',
          '--transition-step': '200ms',
          '--delay': '0s',
          '--percent-to-deg': '3.6deg',
          transform: 'translateZ(0)',
        } as React.CSSProperties
      }
    >
      <svg fill="none" className="size-full" strokeWidth={strokeWidth} viewBox={`0 0 ${sizeInPx} ${sizeInPx}`}>
        {currentPercent <= 90 && currentPercent >= 0 && (
          <circle
            cx={sizeInPx / 2}
            cy={sizeInPx / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDashoffset="0"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-100"
            style={
              {
                stroke: gaugeSecondaryColor,
                '--stroke-percent': 90 - currentPercent,
                '--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
                strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
                transform:
                  'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
                transition: 'all var(--transition-length) ease var(--delay)',
                transformOrigin: 'center',
              } as React.CSSProperties
            }
          />
        )}
        <circle
          cx={sizeInPx / 2}
          cy={sizeInPx / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-100"
          style={
            {
              stroke: gaugePrimaryColor,
              '--stroke-percent': currentPercent,
              strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
              transition: 'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
              transitionProperty: 'stroke-dasharray,transform',
              transform: 'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
              transformOrigin: 'center',
            } as React.CSSProperties
          }
        />
      </svg>
      <span
        data-current-value={currentPercent}
        className="animate-in fade-in absolute inset-0 m-auto flex size-fit items-center justify-center delay-[var(--delay)] duration-[var(--transition-length)] ease-linear"
      >
        {Math.round(currentPercent)}%
      </span>
    </div>
  );
};
