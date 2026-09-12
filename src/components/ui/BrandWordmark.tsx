import React from 'react';

export interface BrandWordmarkProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  const sizeClasses = {
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
      className={`brand-wordmark select-none font-bold tracking-[0.07em] ${sizeClasses[size]} ${
        isClickable ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      Resume Craft
    </span>
  );
};

export default BrandWordmark;
