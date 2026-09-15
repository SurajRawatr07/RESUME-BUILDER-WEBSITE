import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Download / Export Icon
 * Pure monoline black SVG with tray stroke draw and fluid descending arrow path animation.
 */
export const AnimatedExportIcon: React.FC<AnimatedIconProps> = ({
  isHovered = false,
  className = 'w-7 h-7 sm:w-8 sm:h-8',
  size,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const active = isHovered && !shouldReduceMotion;

  const transition = {
    duration: 0.65,
    ease: [0.25, 1, 0.5, 1],
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[#111111] dark:text-neutral-100 ${className}`}
      aria-hidden="true"
    >
      {/* Receiving Tray Bracket */}
      <motion.path
        d="M 4 15 L 4 19 C 4 20.1 4.9 21 6 21 L 18 21 C 19.1 21 20 20.1 20 19 L 20 15"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Downward Arrow Group */}
      <motion.g
        animate={
          active
            ? {
                y: [0, -2, 2, 0],
              }
            : { y: 0 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Arrow Shaft Line */}
        <motion.line
          x1="12"
          y1="3.5"
          x2="12"
          y2="15.5"
          animate={
            active
              ? { pathLength: [0, 1], opacity: [0.2, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ ...transition, delay: 0.1 }}
        />

        {/* Arrow Head Chevron */}
        <motion.path
          d="M 7.5 11 L 12 15.5 L 16.5 11"
          animate={
            active
              ? { pathLength: [0, 1], opacity: [0.2, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ ...transition, delay: 0.2 }}
        />
      </motion.g>
    </svg>
  );
};

export default AnimatedExportIcon;
