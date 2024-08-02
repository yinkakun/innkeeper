import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return <div className={cn('flex min-h-[100dvh] flex-col bg-gray-50 bg-opacity-50', className)}>{children}</div>;
};
