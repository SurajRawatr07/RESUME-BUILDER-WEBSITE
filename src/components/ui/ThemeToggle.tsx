import CinematicThemeSwitcher, { CinematicThemeSwitcherProps } from "./CinematicThemeSwitcher";

export interface ThemeToggleProps {
  size?: number | "sm" | "md" | "lg" | "navbar";
  className?: string;
}

export default function ThemeToggle({
  size = "navbar",
  className = "",
}: ThemeToggleProps) {
  const mappedSize = typeof size === "number" ? "navbar" : size;
  return <CinematicThemeSwitcher size={mappedSize} className={className} />;
}

export { CinematicThemeSwitcher };

