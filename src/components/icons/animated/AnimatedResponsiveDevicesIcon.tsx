import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedResponsiveDevicesIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Desktop / Laptop Screen */}
      <rect x="2" y="4" width="14" height="10" rx="1.8" />
      {/* Desktop Screen Header line */}
      <motion.line
        x1="5"
        y1="7"
        x2="12"
        y2="7"
        animate={{
          scaleX: active ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformOrigin: '5px 7px' }}
      />
      {/* Desktop Screen Content lines */}
      <motion.line
        x1="5"
        y1="9.5"
        x2="10"
        y2="9.5"
        animate={{
          scaleX: active ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeInOut' }}
        style={{ transformOrigin: '5px 9.5px' }}
      />

      {/* Monitor Stand Base */}
      <path d="M 6 18 L 12 18 M 9 14 L 9 18" strokeWidth={1.6} />

      {/* Mobile Smartphone (Right Foreground) */}
      <motion.g
        animate={{
          y: active ? [0, -2, 0] : 0,
        }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
      >
        <rect
          x="15"
          y="8.5"
          width="7"
          height="12.5"
          rx="1.8"
          fill="currentColor"
          fillOpacity="0.08"
        />
        {/* Mobile screen lines */}
        <line x1="17" y1="12" x2="20" y2="12" strokeWidth={1.2} />
        <line x1="17" y1="14.5" x2="19.5" y2="14.5" strokeWidth={1.2} />
        {/* Mobile Home Bar */}
        <line x1="17.5" y1="18.5" x2="19.5" y2="18.5" strokeWidth={1.4} opacity="0.6" />
      </motion.g>
    </svg>
  );
};

export default AnimatedResponsiveDevicesIcon;
