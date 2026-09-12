import React from 'react';
import { cn } from '@/lib/utils';

export type GlowingShadowVariant =
  | 'card'
  | 'subtle'
  | 'primary'
  | 'button'
  | 'navbar'
  | 'panel';

export interface GlowingShadowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlowingShadowVariant;
  interactive?: boolean;
  active?: boolean;
  rounded?: string;
  glowClassName?: string;
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * GlowingShadow component inspired by 21st.dev's glowing-shadow.
 * Adapted specifically for Resume Craft's editorial palette:
 * - Light mode: warm brown, muted gold, soft beige, restrained neutral accent
 * - Dark mode: warm white, muted gold, soft amber, restrained neutral glow
 * - Slow ambient 11s rotation, soft blurred outer depth, and smooth hover response.
 * - Respects prefers-reduced-motion: reduce.
 */
export const GlowingShadow = React.forwardRef<HTMLDivElement, GlowingShadowProps>(
  (
    {
      variant = 'card',
      interactive = true,
      active = false,
      rounded = 'rounded-2xl',
      className,
      glowClassName,
      as: Component = 'div',
      children,
      ...props
    },
    ref
  ) => {
    const isStatic = variant === 'navbar';
    const isButton = variant === 'button';

    // Restrained opacity levels matching Resume Craft's editorial tone
    let opacityClasses = '';
    if (active) {
      opacityClasses = 'opacity-85 dark:opacity-95';
    } else {
      switch (variant) {
        case 'primary':
          // Template cards, main Auth card
          opacityClasses =
            'opacity-30 dark:opacity-35 group-hover:opacity-85 dark:group-hover:opacity-95';
          break;
        case 'card':
          // Standard cards
          opacityClasses =
            'opacity-25 dark:opacity-30 group-hover:opacity-75 dark:group-hover:opacity-85';
          break;
        case 'subtle':
          // Features, How It Works, FAQ items
          opacityClasses =
            'opacity-15 dark:opacity-20 group-hover:opacity-60 dark:group-hover:opacity-70';
          break;
        case 'button':
          // CTA buttons (rests clean, reveals on hover)
          opacityClasses =
            'opacity-0 group-hover:opacity-75 dark:group-hover:opacity-85';
          break;
        case 'navbar':
          // Restrained ambient glow for floating navbar pill
          opacityClasses = 'opacity-35 dark:opacity-45';
          break;
        case 'panel':
          // Modal dialogs
          opacityClasses = 'opacity-40 dark:opacity-50';
          break;
      }
    }

    // Interactive hover transform (subtle scale & lift)
    const interactiveClasses =
      interactive && !isButton
        ? 'transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.012] motion-reduce:transform-none'
        : interactive && isButton
        ? 'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] motion-reduce:transform-none'
        : '';

    return (
      <Component
        ref={ref}
        className={cn(
          'relative group isolate',
          rounded,
          interactiveClasses,
          className
        )}
        {...props}
      >
        {/* Glowing shadow layer (positioned behind content) */}
        <div
          aria-hidden="true"
          className={cn(
            'glowing-shadow-layer pointer-events-none absolute -z-10 transition-opacity duration-400 ease-out',
            rounded,
            isButton
              ? '-inset-0.5 filter blur-md sm:blur-lg'
              : '-inset-1 sm:-inset-1.5 filter blur-lg sm:blur-xl md:blur-2xl',
            opacityClasses,
            glowClassName
          )}
        >
          {/* Inner clipped boundary to keep the glow aligned to the card's geometry */}
          <div className={cn('absolute inset-0 overflow-hidden', rounded)}>
            <div
              className={cn(
                'absolute -inset-[50%] w-[200%] h-[200%] m-auto',
                isStatic
                  ? 'glowing-static-bg'
                  : 'glowing-conic-bg glowing-shadow-spin'
              )}
            />
          </div>
        </div>

        {/* Card Content Layer */}
        {children}
      </Component>
    );
  }
);

GlowingShadow.displayName = 'GlowingShadow';

export default GlowingShadow;
