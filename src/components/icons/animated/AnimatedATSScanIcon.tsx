import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated ATS Scanner Icon
 * Pure monoline black SVG with document path draw, scanning sweep, and checkmark validation.
 */
export const AnimatedATSScanIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Resume Document Outline */}
      <motion.path
        d="M 4 3 L 13 3 L 18 8 L 18 14 M 14 21 L 6 21 C 4.9 21 4 20.1 4 19 L 4 3"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Folded Corner */}
      <motion.path
        d="M 13 3 L 13 8 L 18 8"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.1 }}
      />

      {/* Resume Content Lines */}
      <motion.line
        x1="7"
        y1="11"
        x2="14"
        y2="11"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.18 }}
      />
      <motion.line
        x1="7"
        y1="14"
        x2="12"
        y2="14"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.24 }}
      />
      <motion.line
        x1="7"
        y1="17"
        x2="11"
        y2="17"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.3 }}
      />

      {/* Horizontal Scanning Line */}
      <motion.line
        x1="2.5"
        y1="9"
        x2="19.5"
        y2="9"
        animate={
          active
            ? {
                y: [0, 6, 0],
                opacity: [0.4, 0.9, 0.4],
              }
            : { y: 0, opacity: 0.5 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Verification Check Badge Circle */}
      <motion.circle
        cx="17.5"
        cy="17.5"
        r="4"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.35 }}
      />

      {/* Verification Checkmark */}
      <motion.path
        d="M 15.5 17.5 L 17 19 L 19.5 16"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.45 }}
      />
    </svg>
  );
};

export default AnimatedATSScanIcon;
