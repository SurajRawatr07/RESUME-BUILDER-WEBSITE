import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedAddInfoIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Document / Card Border */}
      <motion.rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2.5"
        animate={{
          strokeOpacity: active ? [0.8, 1, 0.8] : 0.85,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* User Avatar - Head */}
      <motion.circle
        cx="8.5"
        cy="8.5"
        r="2"
        animate={{
          y: active ? [0, -0.8, 0] : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* User Avatar - Shoulders */}
      <motion.path
        d="M 5.5 13.5 C 5.5 12 6.8 11.2 8.5 11.2 C 10.2 11.2 11.5 12 11.5 13.5"
        animate={{
          y: active ? [0, -0.5, 0] : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Information Line 1 (Name / Title) */}
      <motion.line
        x1="13.5"
        y1="8"
        x2="18"
        y2="8"
        animate={{
          x2: active ? [15, 18, 18] : 18,
          opacity: active ? [0.6, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.05, ease: 'easeInOut' }}
      />

      {/* Information Line 2 (Contact / Skills) */}
      <motion.line
        x1="13.5"
        y1="11"
        x2="17"
        y2="11"
        animate={{
          x2: active ? [14.5, 17, 17] : 17,
          opacity: active ? [0.5, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
      />

      {/* Information Line 3 (Active entry field) */}
      <motion.line
        x1="6"
        y1="17"
        x2="14"
        y2="17"
        animate={{
          x2: active ? [9, 14, 14] : 14,
          opacity: active ? [0.4, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.55, delay: 0.15, ease: 'easeInOut' }}
      />

      {/* Precise Pen / Cursor adding data */}
      <motion.g
        animate={{
          x: active ? [0, 2, 0] : 0,
          y: active ? [0, -1, 0] : 0,
          rotate: active ? [0, -6, 0] : 0,
        }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        style={{ transformOrigin: '17px 16px' }}
      >
        <path d="M 15.5 15.5 L 18 13 L 19 14 L 16.5 16.5 Z" />
        <line x1="15.5" y1="15.5" x2="15" y2="17" />
        <line x1="15" y1="17" x2="16.5" y2="16.5" />
      </motion.g>
    </svg>
  );
};

export default AnimatedAddInfoIcon;
