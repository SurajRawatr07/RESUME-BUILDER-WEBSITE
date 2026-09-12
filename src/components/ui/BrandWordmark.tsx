import React from 'react';

interface BrandWordmarkProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl lg:text-4xl',
  };

  return (
    <span
      onClick={onClick}
      className={`brand-wordmark ${sizeClasses[size]} ${className}`}
    >
      Resume Craft
    </span>
  );
};
