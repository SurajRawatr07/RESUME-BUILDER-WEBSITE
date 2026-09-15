import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedCustomizeResumeIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Document boundary / canvas */}
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

      {/* Top Customizer Track */}
      <line x1="6" y1="8" x2="18" y2="8" opacity="0.4" />
      {/* Top Slider Knob (Starts at x=10, moves to x=15 and returns) */}
      <motion.circle
        cx="10"
        cy="8"
        r="2"
        fill="currentColor"
        fillOpacity="0.15"
        animate={{
          cx: active ? [10, 14.5, 10] : 10,
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* Middle Customizer Track */}
      <line x1="6" y1="12" x2="18" y2="12" opacity="0.4" />
      {/* Middle Slider Knob (Starts at x=15, moves to x=9 and returns) */}
      <motion.circle
        cx="15"
        cy="12"
        r="2"
        fill="currentColor"
        fillOpacity="0.15"
        animate={{
          cx: active ? [15, 9.5, 15] : 15,
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* Bottom Customizer Track */}
      <line x1="6" y1="16" x2="18" y2="16" opacity="0.4" />
      {/* Bottom Slider Knob (Starts at x=8.5, moves to x=13 and returns) */}
      <motion.circle
        cx="8.5"
        cy="16"
        r="2"
        fill="currentColor"
        fillOpacity="0.15"
        animate={{
          cx: active ? [8.5, 13, 8.5] : 8.5,
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
    </svg>
  );
};

export default AnimatedCustomizeResumeIcon;
