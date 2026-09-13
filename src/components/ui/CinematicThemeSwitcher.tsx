import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface CinematicThemeSwitcherProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "navbar";
}

/**
 * CinematicThemeSwitcher
 *
 * A premium, pill-shaped theme toggle featuring:
 * - Glossy neumorphic track with subtle inner shadows and specular highlights
 * - Circular sliding thumb with spring physics (stiffness: 300, damping: 20)
 * - Warm ivory / off-white styling in Light Mode
 * - Deep charcoal / near-black metallic styling in Dark Mode
 * - Accessible switch role with keyboard activation (Enter / Space)
 * - Full hydration safety and prefers-reduced-motion support
 */
export default function CinematicThemeSwitcher({
  className = "",
  size = "navbar",
}: CinematicThemeSwitcherProps) {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  };

  // Dynamic spring physics matching requirement
  const springTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      };

  // Responsive sizing configurations matching user specifications:
  // Desktop: 44–52px wide × 28–34px high (e.g. 48px × 30px)
  // Mobile: 38–44px wide × 26–30px high (e.g. 40px × 26px)
  const sizeClasses = {
    navbar: "w-[40px] h-[26px] p-[2.5px] sm:w-[48px] sm:h-[30px] sm:p-[3px]",
    sm: "w-[38px] h-[26px] p-[2.5px]",
    md: "w-[46px] h-[29px] p-[2.5px]",
    lg: "w-[54px] h-[32px] p-[3px]",
  }[size];

  const thumbSizeClasses = {
    navbar: "w-[21px] h-[21px] sm:w-[24px] sm:h-[24px]",
    sm: "w-[21px] h-[21px]",
    md: "w-[24px] h-[24px]",
    lg: "w-[26px] h-[26px]",
  }[size];

  const iconSizeClasses = {
    navbar: "w-3 h-3 sm:w-3.5 sm:h-3.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  // Hydration safety placeholder: identical dimensions to avoid any visual layout jump
  if (!mounted) {
    return (
      <div
        className={`relative inline-flex items-center select-none ${className}`}
        aria-hidden="true"
      >
        <div
          className={`rounded-full border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-[#171717] ${sizeClasses} opacity-60`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <motion.button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        tabIndex={0}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        className={`relative rounded-full cursor-pointer transition-colors duration-200 flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${sizeClasses} ${
          isDark
            ? "justify-end bg-[#1a1a1a] border border-white/[0.12]"
            : "justify-start bg-neutral-200/90 border border-black/[0.08]"
        }`}
        style={{
          boxShadow: isDark
            ? "inset 0 1px 3px rgba(0, 0, 0, 0.55), 0 1px 2px rgba(0, 0, 0, 0.3)"
            : "inset 0 1px 2px rgba(0, 0, 0, 0.08), inset 0 -1px 1px rgba(255, 255, 255, 0.75), 0 1px 2px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Glossy Sliding Thumb with spring physics */}
        <motion.div
          layout
          transition={springTransition}
          className={`relative z-10 rounded-full flex items-center justify-center shrink-0 ${thumbSizeClasses} ${
            isDark
              ? "bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] text-neutral-100 border border-white/[0.18]"
              : "bg-gradient-to-b from-[#FFFFFF] to-[#F4F4F4] text-neutral-800 border border-black/[0.08]"
          }`}
          style={{
            boxShadow: isDark
              ? "0 2px 5px -1px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.18)"
              : "0 2px 4px -1px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.95)",
          }}
        >
          {isDark ? (
            <motion.div
              key="dark-icon"
              initial={{ rotate: -20, scale: 0.85, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 20, scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Moon className={`${iconSizeClasses} stroke-[2]`} />
            </motion.div>
          ) : (
            <motion.div
              key="light-icon"
              initial={{ rotate: 20, scale: 0.85, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -20, scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Sun className={`${iconSizeClasses} stroke-[2]`} />
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

export { CinematicThemeSwitcher };
