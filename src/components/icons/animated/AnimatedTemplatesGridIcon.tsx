import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Professional Templates Icon
 * Pure monoline black SVG with layered layout document sheets and structure path reveals.
 */
export const AnimatedTemplatesGridIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Background Template Sheet Accent */}
      <motion.path
        d="M 7.5 2.5 L 18.5 2.5 C 19.6 2.5 20.5 3.4 20.5 4.5 L 20.5 15.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 0.8] }
            : { pathLength: 1, opacity: 0.6 }
        }
        transition={transition}
      />

      {/* Foreground Main Template Sheet */}
      <motion.rect
        x="3.5"
        y="5.5"
        width="14"
        height="16"
        rx="2"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.1 }}
      />

      {/* Template Header Band */}
      <motion.line
        x1="6.5"
        y1="9.5"
        x2="14.5"
        y2="9.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.2 }}
      />

      {/* Left Sidebar Block */}
      <motion.rect
        x="6.5"
        y="12.5"
        width="3"
        height="6"
        rx="0.75"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.28 }}
      />

      {/* Right Content Line 1 */}
      <motion.line
        x1="11.5"
        y1="13.5"
        x2="15"
        y2="13.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.36 }}
      />

      {/* Right Content Line 2 */}
      <motion.line
        x1="11.5"
        y1="16.5"
        x2="14"
        y2="16.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.42 }}
      />
    </svg>
  );
};

export default AnimatedTemplatesGridIcon;
