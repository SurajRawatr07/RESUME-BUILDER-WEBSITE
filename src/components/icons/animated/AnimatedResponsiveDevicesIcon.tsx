import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

/**
 * Line MD style: Animated Responsive Devices Icon
 * Pure monoline black SVG with desktop monitor and companion smartphone synchronized stroke drawing.
 */
export const AnimatedResponsiveDevicesIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Desktop Display Frame */}
      <motion.path
        d="M 13.5 14.5 L 3.5 14.5 C 2.9 14.5 2.5 14.1 2.5 13.5 L 2.5 4.5 C 2.5 3.9 2.9 3.5 3.5 3.5 L 18.5 3.5 C 19.1 3.5 19.5 3.9 19.5 4.5 L 19.5 7.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={transition}
      />

      {/* Monitor Stand */}
      <motion.path
        d="M 7 14.5 L 7 18 M 11 14.5 L 11 18 M 5 18 L 13 18"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.15 }}
      />

      {/* Desktop Content Lines */}
      <motion.line
        x1="5"
        y1="6.5"
        x2="11"
        y2="6.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.22 }}
      />
      <motion.line
        x1="5"
        y1="9.5"
        x2="9.5"
        y2="9.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.28 }}
      />

      {/* Mobile Smartphone Frame */}
      <motion.rect
        x="15"
        y="9.5"
        width="6.5"
        height="11.5"
        rx="1.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.3, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.18 }}
      />

      {/* Smartphone Speaker Notch */}
      <motion.line
        x1="17.25"
        y1="11.5"
        x2="19.25"
        y2="11.5"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.32 }}
      />

      {/* Smartphone Content Line */}
      <motion.line
        x1="16.5"
        y1="14"
        x2="20"
        y2="14"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.38 }}
      />

      {/* Smartphone Home Bar */}
      <motion.line
        x1="17.25"
        y1="19"
        x2="19.25"
        y2="19"
        animate={
          active
            ? { pathLength: [0, 1], opacity: [0.2, 1] }
            : { pathLength: 1, opacity: 1 }
        }
        transition={{ ...transition, delay: 0.44 }}
      />
    </svg>
  );
};

export default AnimatedResponsiveDevicesIcon;
