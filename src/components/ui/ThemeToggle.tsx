import BlindPullToggle from "./BlindPullToggle";

export interface ThemeToggleProps {
  size?: number;
  className?: string;
}

export default function ThemeToggle({ size = 34, className = "" }: ThemeToggleProps) {
  return <BlindPullToggle size={size} className={className} />;
}

export { BlindPullToggle };
