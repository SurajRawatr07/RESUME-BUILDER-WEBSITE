import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Customize / Sliders Settings Icon
 * Pure monoline black SVG with track drawing and sliding adjustment rings.
 */
export const AnimatedCustomizeResumeIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Top Slider Track */}
      <motion.line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />
      {/* Top Slider Knob */}
      <motion.circle
        cx="9"
        cy="6"
        r="2.5"
        animate={
          active
            ? {
                cx: [9, 15, 9],
                pathLength: [0, 1],
              }
            : { cx: 9, pathLength: 1 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
      />

      {/* Middle Slider Track */}
      <motion.line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.12 }}
      />
      {/* Middle Slider Knob */}
      <motion.circle
        cx="16"
        cy="12"
        r="2.5"
        animate={
          active
            ? {
                cx: [16, 10, 16],
                pathLength: [0, 1],
              }
            : { cx: 16, pathLength: 1 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
      />

      {/* Bottom Slider Track */}
      <motion.line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.2 }}
      />
      {/* Bottom Slider Knob */}
      <motion.circle
        cx="10"
        cy="18"
        r="2.5"
        animate={
          active
            ? {
                cx: [10, 16, 10],
                pathLength: [0, 1],
              }
            : { cx: 10, pathLength: 1 }
        }
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.28 }}
      />
    </svg>
  );
};

export default AnimatedCustomizeResumeIcon;
