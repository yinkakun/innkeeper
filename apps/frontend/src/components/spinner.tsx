import { cn } from '@/lib/utils';
import { Spinner as Icon } from '@phosphor-icons/react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 20 }) => {
  return <Icon className={cn('animate-spin text-white duration-300', className)} size={size} />;
};
