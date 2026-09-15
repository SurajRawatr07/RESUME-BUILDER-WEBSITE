import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedATSScanIcon: React.FC<AnimatedIconProps> = ({
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
      {/* Document Sheet with Folded Corner */}
      <path d="M 4 3 L 14 3 L 19 8 L 19 21 C 19 21.6 18.5 22 17.9 22 L 5.1 22 C 4.5 22 4 21.6 4 21 Z" />
      {/* Fold Corner */}
      <path d="M 14 3 L 14 8 L 19 8" opacity="0.6" />

      {/* Semantic Resume Text Lines */}
      <motion.line
        x1="7"
        y1="11"
        x2="15"
        y2="11"
        animate={{
          opacity: active ? [0.6, 1, 0.85] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.line
        x1="7"
        y1="14"
        x2="13"
        y2="14"
        animate={{
          opacity: active ? [0.6, 1, 0.85] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.line
        x1="7"
        y1="17"
        x2="11"
        y2="17"
        animate={{
          opacity: active ? [0.6, 1, 0.85] : 0.85,
        }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* ATS Scanner Beam */}
      <motion.line
        x1="5.5"
        y1="10"
        x2="17.5"
        y2="10"
        strokeWidth={1.5}
        strokeDasharray="1 1"
        animate={{
          y: active ? [0, 8, 0] : 0,
          opacity: active ? [0.4, 1, 0.4] : 0.4,
        }}
        transition={{ duration: 0.75, ease: 'easeInOut' }}
      />

      {/* ATS Verified Compliance Checkmark Badge */}
      <motion.g
        animate={{
          scale: active ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
        style={{ transformOrigin: '17px 18px' }}
      >
        <circle cx="16.5" cy="17.5" r="3.5" fill="currentColor" fillOpacity="0.12" />
        <motion.path
          d="M 15 17.5 L 16.2 18.7 L 18 16.2"
          animate={{
            pathLength: active ? [0.3, 1] : 1,
          }}
          transition={{ duration: 0.4, delay: 0.25 }}
        />
      </motion.g>
    </svg>
  );
};

export default AnimatedATSScanIcon;
