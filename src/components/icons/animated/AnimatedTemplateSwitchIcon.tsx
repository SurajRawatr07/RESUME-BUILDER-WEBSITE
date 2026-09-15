import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedTemplateSwitchIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Central Persistent Resume Document (Content stays intact during switch) */}
      <motion.rect
        x="8.5"
        y="8.5"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        fillOpacity="0.1"
        animate={{
          scale: active ? [1, 0.9, 1] : 1,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 12px' }}
      />
      <line x1="10" y1="10.5" x2="14" y2="10.5" strokeWidth={1.2} />
      <line x1="10" y1="12.5" x2="13" y2="12.5" strokeWidth={1.2} />

      {/* Rotating Dual Switch Arrows Loop */}
      <motion.g
        animate={{
          rotate: active ? [0, 180] : 0,
        }}
        transition={{ duration: 0.75, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 12px' }}
      >
        {/* Top Clockwise Arc */}
        <path d="M 12 3.5 A 8.5 8.5 0 0 1 20.5 12" />
        <polyline points="18 12.5 20.5 12 21 9.5" />

        {/* Bottom Clockwise Arc */}
        <path d="M 12 20.5 A 8.5 8.5 0 0 1 3.5 12" />
        <polyline points="6 11.5 3.5 12 3 14.5" />
      </motion.g>
    </svg>
  );
};

export default AnimatedTemplateSwitchIcon;
