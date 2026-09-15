import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Document Template Icon
 * Pure monoline black SVG with staggered stroke path drawing.
 */
export const AnimatedChooseTemplateIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Outer Document Sheet Frame */}
      <motion.path
        d="M 4 3 L 14 3 L 19 8 L 19 21 C 19 21.6 18.5 22 17.9 22 L 5.1 22 C 4.5 22 4 21.6 4 21 Z"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Folded Top-Right Corner */}
      <motion.path
        d="M 14 3 L 14 8 L 19 8"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.12 }}
      />

      {/* Header Bar */}
      <motion.line
        x1="7"
        y1="11"
        x2="16"
        y2="11"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.2 }}
      />

      {/* Column Split Line */}
      <motion.line
        x1="11"
        y1="13.5"
        x2="11"
        y2="18.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.28 }}
      />

      {/* Left Column Entry Line */}
      <motion.line
        x1="7"
        y1="14.5"
        x2="9.5"
        y2="14.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.35 }}
      />
      <motion.line
        x1="7"
        y1="17.5"
        x2="9.5"
        y2="17.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.4 }}
      />

      {/* Right Column Content Lines */}
      <motion.line
        x1="13"
        y1="14.5"
        x2="16"
        y2="14.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.45 }}
      />
      <motion.line
        x1="13"
        y1="17.5"
        x2="15.5"
        y2="17.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.5 }}
      />
    </svg>
  );
};

export default AnimatedChooseTemplateIcon;
