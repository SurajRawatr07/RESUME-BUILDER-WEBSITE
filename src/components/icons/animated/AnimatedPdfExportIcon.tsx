import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated PDF Export Document Icon
 * Pure monoline black SVG with PDF document boundary draw and downward export indicator.
 */
export const AnimatedPdfExportIcon: React.FC<AnimatedIconProps> = ({
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
      {/* PDF Document Frame */}
      <motion.path
        d="M 4.5 3.5 L 14 3.5 L 19.5 9 L 19.5 20.5 C 19.5 21 19 21.5 18.5 21.5 L 5.5 21.5 C 5 21.5 4.5 21 4.5 20.5 Z"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Folded Document Corner */}
      <motion.path
        d="M 14 3.5 L 14 9 L 19.5 9"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.12 }}
      />

      {/* Vector Letter 'P' */}
      <motion.path
        d="M 7.5 12 L 7.5 16.5 M 7.5 12 L 9.5 12 C 10.3 12 11 12.6 11 13.3 C 11 14 10.3 14.6 9.5 14.6 L 7.5 14.6"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.22 }}
      />

      {/* Vector Letter 'D' */}
      <motion.path
        d="M 12.5 12 L 12.5 16.5 M 12.5 12 L 14 12 C 15.1 12 16 12.9 16 14.25 C 16 15.6 15.1 16.5 14 16.5 L 12.5 16.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.3 }}
      />

      {/* Vector Letter 'F' */}
      <motion.path
        d="M 17.5 12 L 17.5 16.5 M 17.5 12 L 19.5 12 M 17.5 14.2 L 19 14.2"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.38 }}
      />

      {/* Bottom Download Micro Chevron */}
      <motion.path
        d="M 10 19 L 12 20.5 L 14 19"
        animate={
          active
            ? {
                y: [0, 1.5, 0],
                opacity: [0.4, 1, 0.4],
              }
            : { y: 0, opacity: 0.7 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.25 }}
      />
    </svg>
  );
};

export default AnimatedPdfExportIcon;
