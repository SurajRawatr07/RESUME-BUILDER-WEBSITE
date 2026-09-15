import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Live Resume Edit Icon
 * Pure monoline black SVG with real-time pencil stroke drawing and active line drafting.
 */
export const AnimatedLiveEditIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Document Base Sheet */}
      <motion.path
        d="M 11 4 L 5 4 C 4.4 4 4 4.4 4 5 L 4 19 C 4 19.6 4.4 20 5 20 L 17 20 C 17.6 20 18 19.6 18 19 L 18 13"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Static Document Text Lines */}
      <motion.line
        x1="7"
        y1="16"
        x2="13"
        y2="16"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.15 }}
      />
      <motion.line
        x1="7"
        y1="12.5"
        x2="11"
        y2="12.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.22 }}
      />

      {/* Live Edited Text Line (Draws from Left to Right) */}
      <motion.line
        x1="7"
        y1="9"
        x2="12.5"
        y2="9"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.28 }}
      />

      {/* Typing Cursor */}
      <motion.line
        x1="13.5"
        y1="7.5"
        x2="13.5"
        y2="10.5"
        animate={
          active
            ? { opacity: [1, 0, 1, 0, 1] }
            : { opacity: 1 }
        }
        transition={{ duration: 0.7, delay: 0.3 }}
      />

      {/* Precision Drafting Stylus / Pencil */}
      <motion.g
        animate={
          active
            ? {
                x: [0, -1, 1, 0],
                y: [0, 1, -1, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.path
          d="M 13.5 6.5 L 18 2 L 22 6 L 17.5 10.5 L 13 11 L 13.5 6.5 Z"
          animate={
            active
              ? { pathLength: [0, 1], opacity: [0.2, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ ...transition, delay: 0.1 }}
        />
        <motion.line
          x1="16.5"
          y1="3.5"
          x2="20.5"
          y2="7.5"
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

export default AnimatedLiveEditIcon;
