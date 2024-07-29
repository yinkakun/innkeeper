import React from 'react';
import { motion, Transition, Variants } from 'framer-motion';

interface MarqueeProps {
  speed?: number;
  direction?: 'left' | 'right';
  children: React.ReactNode;
}

export const Marquee: React.FC<MarqueeProps> = ({ children, direction = 'left', speed = 50 }) => {
  const transition: Transition = {
    x: {
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
      duration: 1000 / speed,
    },
  };

  const variants: Variants = {
    second: {
      x: direction === 'left' ? [1000, 0] : [0, 1000],
    },
    first: {
      x: direction === 'left' ? [0, -1000] : [-1000, 0],
    },
  };

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-block" variants={variants} animate="first" transition={transition}>
        {children}
      </motion.div>
      <motion.div className="inline-block" variants={variants} animate="second" transition={transition}>
        {children}
      </motion.div>
    </div>
  );
};
