import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedChooseTemplateIcon: React.FC<AnimatedIconProps> = ({
  isHovered = false,
  className = 'w-7 h-7 sm:w-8 sm:h-8',
  size,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const active = isHovered && !shouldReduceMotion;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Template Document Frame */}
      <motion.rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2.5"
        animate={{
          strokeDashoffset: active ? [0, 2, 0] : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Top Header Accent Banner */}
      <motion.line
        x1="6"
        y1="7"
        x2="18"
        y2="7"
        animate={{
          scaleX: active ? [1, 1.05, 1] : 1,
          opacity: active ? [0.7, 1, 0.7] : 0.8,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Left Sidebar Layout Column */}
      <motion.rect
        x="6"
        y="10"
        width="4"
        height="8"
        rx="1"
        animate={{
          y: active ? [10, 11, 10] : 10,
          opacity: active ? [0.6, 1, 0.6] : 0.7,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Content Line 1 */}
      <motion.line
        x1="13"
        y1="11"
        x2="18"
        y2="11"
        animate={{
          x2: active ? [15, 18, 18] : 18,
          opacity: active ? [0.5, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.05, ease: 'easeInOut' }}
      />

      {/* Content Line 2 */}
      <motion.line
        x1="13"
        y1="14"
        x2="17"
        y2="14"
        animate={{
          x2: active ? [14, 17, 17] : 17,
          opacity: active ? [0.5, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
      />

      {/* Content Line 3 */}
      <motion.line
        x1="13"
        y1="17"
        x2="15"
        y2="17"
        animate={{
          x2: active ? [13, 15, 15] : 15,
          opacity: active ? [0.4, 0.9, 0.8] : 0.7,
        }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeInOut' }}
      />
    </svg>
  );
};

export default AnimatedChooseTemplateIcon;
