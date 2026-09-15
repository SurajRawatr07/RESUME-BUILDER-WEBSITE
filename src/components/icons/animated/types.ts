export interface AnimatedIconProps {
  /**
   * Whether the parent card or icon is hovered.
   * Controls micro-interaction triggering.
   */
  isHovered?: boolean;
  /**
   * Custom CSS classes applied to the root SVG element.
   */
  className?: string;
  /**
   * Explicit size in pixels or CSS units (optional, defaults to responsive CSS).
   */
  size?: number | string;
}
