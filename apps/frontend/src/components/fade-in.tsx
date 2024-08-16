import React from 'react';
import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

interface FadeInProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const FadeIn: React.FC<FadeInProps> = ({ className, delay, children }) => {
  const variant: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: [0.17, 0.55, 0.55, 1],
      },
    },
  };

  return (
    <motion.div initial="initial" whileInView="animate" className={cn(className)} variants={variant}>
      {children}
    </motion.div>
  );
};
