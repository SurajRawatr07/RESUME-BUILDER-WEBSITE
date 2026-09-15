import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedLiveEditIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Editor Screen / Canvas */}
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

      {/* Static Header Line */}
      <line x1="6.5" y1="7.5" x2="13.5" y2="7.5" opacity="0.85" />

      {/* Static Body Line */}
      <line x1="6.5" y1="11.5" x2="17.5" y2="11.5" opacity="0.85" />

      {/* Dynamic Typing Line */}
      <motion.line
        x1="6.5"
        y1="15.5"
        x2="11"
        y2="15.5"
        animate={{
          x2: active ? [9.5, 14, 11] : 11,
          opacity: active ? [0.6, 1, 0.85] : 0.85,
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* Live Text Blinking Cursor */}
      <motion.line
        x1="11.5"
        y1="14"
        x2="11.5"
        y2="17"
        strokeWidth={2}
        animate={{
          x: active ? [0, 3, 0] : 0,
          opacity: active ? [1, 0.2, 1, 0.3, 1] : [1, 0.4, 1],
        }}
        transition={{
          duration: 0.7,
          ease: 'easeInOut',
        }}
      />

      {/* Live Sparkle / Instant Edit Star (Top Right) */}
      <motion.path
        d="M 16.5 4.5 L 17 6 L 18.5 6.5 L 17 7 L 16.5 8.5 L 16 7 L 14.5 6.5 L 16 6 Z"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth={1.2}
        animate={{
          scale: active ? [1, 1.25, 1] : 1,
          rotate: active ? [0, 45, 0] : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformOrigin: '16.5px 6.5px' }}
      />
    </svg>
  );
};

export default AnimatedLiveEditIcon;
