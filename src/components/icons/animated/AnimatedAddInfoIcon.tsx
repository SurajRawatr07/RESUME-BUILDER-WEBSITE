import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated User / Personal Information Icon
 * Pure monoline black SVG with avatar drawing and information field lines.
 */
export const AnimatedAddInfoIcon: React.FC<AnimatedIconProps> = ({
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
      {/* User Avatar Head Circle */}
      <motion.circle
        cx="9"
        cy="7.5"
        r="3.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* User Torso & Shoulders Arc */}
      <motion.path
        d="M 2.5 20 C 2.5 16 5.5 13.5 9 13.5 C 10.8 13.5 12.4 14.2 13.5 15.3"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.15 }}
      />

      {/* Information Header Line */}
      <motion.line
        x1="15"
        y1="6"
        x2="21.5"
        y2="6"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.25 }}
      />

      {/* Information Sub-line */}
      <motion.line
        x1="15"
        y1="9.5"
        x2="19.5"
        y2="9.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.32 }}
      />

      {/* Edit / Add Badge Circle */}
      <motion.circle
        cx="18.5"
        cy="17.5"
        r="3.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.38 }}
      />

      {/* Plus Icon Inside Add Badge */}
      <motion.path
        d="M 18.5 15.5 L 18.5 19.5 M 16.5 17.5 L 20.5 17.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.48 }}
      />
    </svg>
  );
};

export default AnimatedAddInfoIcon;
