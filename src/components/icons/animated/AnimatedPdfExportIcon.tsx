import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedIconProps } from './types';

export const AnimatedPdfExportIcon: React.FC<AnimatedIconProps> = ({
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
      {/* PDF Document Outline */}
      <path d="M 4.5 3 L 14.5 3 L 19.5 8 L 19.5 21 C 19.5 21.6 19 22 18.4 22 L 5.6 22 C 5 22 4.5 21.6 4.5 21 Z" />

      {/* Fold Corner with subtle hover curl */}
      <motion.path
        d="M 14.5 3 L 14.5 8 L 19.5 8"
        animate={{
          x: active ? [0, -0.5, 0] : 0,
          y: active ? [0, 0.5, 0] : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformOrigin: '14.5px 8px' }}
      />

      {/* PDF Badge / Label Pill */}
      <rect
        x="7"
        y="11.5"
        width="10"
        height="5.5"
        rx="1.2"
        strokeWidth={1.4}
        fill="currentColor"
        fillOpacity="0.1"
      />

      {/* "PDF" Minimalist Vector Mark inside badge */}
      {/* P */}
      <path d="M 8.8 13 L 8.8 15.5 M 8.8 13 L 9.8 13 C 10.3 13 10.6 13.3 10.6 13.8 C 10.6 14.3 10.3 14.6 9.8 14.6 L 8.8 14.6" strokeWidth={1.2} />
      {/* D */}
      <path d="M 11.5 13 L 11.5 15.5 M 11.5 13 L 12.3 13 C 13.1 13 13.5 13.5 13.5 14.25 C 13.5 15 13.1 15.5 12.3 15.5 L 11.5 15.5" strokeWidth={1.2} />
      {/* F */}
      <path d="M 14.4 13 L 14.4 15.5 M 14.4 13 L 15.5 13 M 14.4 14.2 L 15.2 14.2" strokeWidth={1.2} />

      {/* Downward Download / Export Arrow at bottom */}
      <motion.g
        animate={{
          y: active ? [0, 2.5, 0] : 0,
        }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
      >
        <line x1="12" y1="5.5" x2="12" y2="9.5" strokeWidth={1.6} />
        <polyline points="10 8 12 9.8 14 8" strokeWidth={1.6} />
      </motion.g>
    </svg>
  );
};

export default AnimatedPdfExportIcon;
