import React from 'react';

export interface BrandWordmarkProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'classic' | 'futuristic';
  onClick?: () => void;
  id?: string;
  ariaLabel?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
  size = 'md',
  variant = 'classic',
  onClick,
  id,
  ariaLabel = 'Resume Craft',
}) => {
  const isFuturistic = variant === 'futuristic';

  // Compact size scale strictly following requirements:
  // Desktop: ~16–20px, Tablet: ~15–18px, Mobile: ~14–16px
  const sizeClasses = isFuturistic
    ? {
        xs: 'text-xs',
        sm: 'text-[14px] sm:text-[15px]',
        md: 'text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px]',
        lg: 'text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px]',
        xl: 'text-[18px] sm:text-[20px] md:text-[22px]',
      }
    : {
        xs: 'text-xs',
        sm: 'text-sm sm:text-base',
        md: 'text-base sm:text-lg md:text-xl',
        lg: 'text-xl sm:text-2xl',
        xl: 'text-2xl sm:text-3xl lg:text-4xl',
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
      className={`${
        isFuturistic ? 'brand-wordmark-futuristic' : 'brand-wordmark'
      } select-none transition-colors whitespace-nowrap ${
        isFuturistic
          ? 'font-semibold tracking-[-0.01em] text-neutral-950 dark:text-white'
          : 'font-bold tracking-[0.07em]'
      } ${sizeClasses[size]} ${
        isClickable ? 'cursor-pointer hover:opacity-85' : ''
      } ${className}`}
      style={{
        fontFamily: isFuturistic
          ? "'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important"
          : '"Times New Roman", Times, serif',
      }}
    >
      Resume Craft
    </span>
  );
};

export default BrandWordmark;
