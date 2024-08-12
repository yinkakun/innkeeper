import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  width?: number;
  height?: number;
  className?: string;
}
export const DotPattern: React.FC<Props> = ({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, ...props }) => {
  const id = React.useId();

  return (
    <svg aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full fill-gray-500/20', className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x={x} y={y}>
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
};
