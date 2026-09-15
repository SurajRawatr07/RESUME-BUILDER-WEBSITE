import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedExportIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Downward Download Arrow */}
      <motion.g
        animate={{
          y: active ? [0, -2.5, 2.5, 0] : 0,
        }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
      >
        <line x1="12" y1="4" x2="12" y2="14" />
        <polyline points="8 10 12 14 16 10" />
      </motion.g>

      {/* Export Tray Base */}
      <motion.path
        d="M 4 14.5 L 4 18.5 C 4 19.3 4.7 20 5.5 20 L 18.5 20 C 19.3 20 20 19.3 20 18.5 L 20 14.5"
        animate={{
          y: active ? [0, 1, 0] : 0,
        }}
        transition={{ duration: 0.65, delay: 0.1, ease: 'easeInOut' }}
      />
    </svg>
  );
};

export default AnimatedExportIcon;
