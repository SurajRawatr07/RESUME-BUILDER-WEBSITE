import React from 'react';

export interface BrandWordmarkProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: string;
  onClick?: () => void;
  id?: string;
  ariaLabel?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
  size = 'md',
  onClick,
  id,
  ariaLabel = 'Resume Craft',
}) => {
  // Calibrated size scale ensuring navbar size meets specifications:
  // Desktop: ~16–20px (18.5px–19px)
  // Tablet: ~15–18px (16.5px–17.5px)
  // Mobile: ~14–17px (15px–15.5px)
  const sizeClasses = {
    xs: 'text-[12px] sm:text-[13px]',
    sm: 'text-[14px] sm:text-[15px]',
    md: 'text-[17.5px] sm:text-[18px] lg:text-[20px]',
    lg: 'text-[21px] sm:text-[23px] md:text-[25px]',
    xl: 'text-[28px] sm:text-[32px] md:text-[36px]',
    '2xl': 'text-[34px] sm:text-[40px] md:text-[44px]',
  };

  const isClickable = Boolean(onClick);

  return (
    <span
      id={id}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={ariaLabel}
      className={`brand-wordmark ${
        isClickable ? 'brand-wordmark-interactive cursor-pointer' : ''
      } select-none whitespace-nowrap font-bold text-[#111111] dark:text-white ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: "'Alex Brush', 'Allura', cursive, 'Brush Script MT', -apple-system, sans-serif",
        fontWeight: 700,
      }}
    >
      Resume Craft
    </span>
  );
};

export default BrandWordmark;
