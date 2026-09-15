import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedTemplatesGridIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Background Template Sheet */}
      <motion.rect
        x="6.5"
        y="3"
        width="14.5"
        height="14.5"
        rx="2"
        opacity="0.45"
        strokeDasharray="2 2"
        animate={{
          x: active ? [6.5, 8.5, 6.5] : 6.5,
          y: active ? [3, 1.5, 3] : 3,
          opacity: active ? [0.45, 0.8, 0.45] : 0.45,
        }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
      />

      {/* Foreground Primary Template Sheet */}
      <motion.rect
        x="3"
        y="6.5"
        width="14.5"
        height="14.5"
        rx="2"
        animate={{
          strokeOpacity: active ? [0.9, 1, 0.9] : 0.9,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Internal Layout: Top Header Band */}
      <motion.line
        x1="5.5"
        y1="9.5"
        x2="14.5"
        y2="9.5"
        animate={{
          scaleX: active ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Internal Layout: Left Column */}
      <motion.rect
        x="5.5"
        y="12"
        width="3.5"
        height="6"
        rx="0.8"
        animate={{
          opacity: active ? [0.7, 1, 0.7] : 0.8,
        }}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeInOut' }}
      />

      {/* Internal Layout: Right Text Line 1 */}
      <motion.line
        x1="11"
        y1="13"
        x2="15"
        y2="13"
        animate={{
          x2: active ? [13, 15, 15] : 15,
          opacity: active ? [0.6, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
      />

      {/* Internal Layout: Right Text Line 2 */}
      <motion.line
        x1="11"
        y1="16"
        x2="14"
        y2="16"
        animate={{
          x2: active ? [12.5, 14, 14] : 14,
          opacity: active ? [0.5, 1, 1] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeInOut' }}
      />
    </svg>
  );
};

export default AnimatedTemplatesGridIcon;
