import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Template Switch Icon
 * Pure monoline black SVG with orbital switch arrows rotating around a preserved document core.
 */
export const AnimatedTemplateSwitchIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Central Preserved Document Core */}
      <motion.rect
        x="7.5"
        y="6.5"
        width="9"
        height="11"
        rx="1.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.4, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Preserved Data Content Lines */}
      <motion.line
        x1="9.5"
        y1="9.5"
        x2="14.5"
        y2="9.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.12 }}
      />
      <motion.line
        x1="9.5"
        y1="12"
        x2="13.5"
        y2="12"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.18 }}
      />
      <motion.line
        x1="9.5"
        y1="14.5"
        x2="12"
        y2="14.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.24 }}
      />

      {/* Orbiting Template Switch Arrows */}
      <motion.g
        animate={
          active
            ? { rotate: [0, 180] }
            : { rotate: 0 }
        }
        style={{ originX: '12px', originY: '12px' }}
        transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Top/Right Cycle Arc */}
        <motion.path
          d="M 12 2.5 C 16.8 2.5 20.8 6.2 21.4 11 M 22 8 L 21.4 11 L 18.5 10.2"
          animate={
            active
              ? { pathLength: [0, 1], opacity: [0.3, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ ...transition, delay: 0.05 }}
        />

        {/* Bottom/Left Cycle Arc */}
        <motion.path
          d="M 12 21.5 C 7.2 21.5 3.2 17.8 2.6 13 M 2 16 L 2.6 13 L 5.5 13.8"
          animate={
            active
              ? { pathLength: [0, 1], opacity: [0.3, 1] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={{ ...transition, delay: 0.05 }}
        />
      </motion.g>
    </svg>
  );
};

export default AnimatedTemplateSwitchIcon;
