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

  // Responsive sizing configurations
  const sizeClasses = {
    // Navbar: 68px x 34px on mobile, 76px x 36px on tablet, 84px x 38px on desktop (max well below 104px x 64px)
    navbar: "w-[66px] h-[33px] sm:w-[74px] sm:h-[36px] md:w-[82px] md:h-[38px] p-[3.5px] sm:p-[4px]",
    sm: "w-[64px] h-[32px] p-[3px]",
    md: "w-[76px] h-[36px] p-[4px]",
    lg: "w-[92px] h-[44px] p-[5px]",
  }[size];

  const thumbSizeClasses = {
    navbar: "w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px]",
    sm: "w-[24px] h-[24px]",
    md: "w-[26px] h-[26px]",
    lg: "w-[32px] h-[32px]",
  }[size];

  const iconSizeClasses = {
    navbar: "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  const trackIconSizeClasses = {
    navbar: "w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
  }[size];

  // Hydration safety placeholder: identical dimensions to avoid any visual layout jump
  if (!mounted) {
    return (
      <div
        className={`relative inline-flex items-center select-none ${className}`}
        aria-hidden="true"
      >
        <div
          className={`rounded-full border border-black/10 dark:border-white/10 bg-[#E8E3D8] dark:bg-[#161614] ${sizeClasses} opacity-60`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none min-h-[44px] ${className}`}
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
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        className={`relative rounded-full cursor-pointer transition-colors duration-300 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${sizeClasses} ${
          isDark
            ? "justify-end bg-[#131311] border border-white/[0.12]"
            : "justify-start bg-[#EAE5DC] border border-black/[0.09]"
        }`}
        style={{
          boxShadow: isDark
            ? "inset 0 2px 4px rgba(0, 0, 0, 0.65), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 2px 5px rgba(0, 0, 0, 0.35)"
            : "inset 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 -1px 2px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Track Ambient Icons (Cinematic stationary indicators in background) */}
        <div className="absolute inset-0 px-2 sm:px-2.5 flex items-center justify-between pointer-events-none">
          {/* Sun icon on light side (visible when dark) */}
          <span
            className={`transition-opacity duration-300 flex items-center justify-center ${
              isDark ? "opacity-35 text-amber-200/60" : "opacity-0 text-amber-700"
            }`}
          >
            <Sun className={trackIconSizeClasses} />
          </span>

          {/* Moon icon on dark side (visible when light) */}
          <span
            className={`transition-opacity duration-300 flex items-center justify-center ${
              isDark ? "opacity-0 text-slate-300" : "opacity-30 text-stone-600"
            }`}
          >
            <Moon className={trackIconSizeClasses} />
          </span>
        </div>

        {/* Glossy Sliding Thumb with spring physics */}
        <motion.div
          layout
          transition={springTransition}
          className={`relative z-10 rounded-full flex items-center justify-center shrink-0 ${thumbSizeClasses} ${
            isDark
              ? "bg-gradient-to-b from-[#2d2d29] to-[#1a1a17] text-slate-100 border border-white/[0.16]"
              : "bg-gradient-to-b from-[#FFFFFF] to-[#F5F2EB] text-amber-600 border border-black/[0.08]"
          }`}
          style={{
            boxShadow: isDark
              ? "0 3px 8px -1px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.22)"
              : "0 3px 8px -1px rgba(0, 0, 0, 0.16), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.95)",
          }}
        >
          {isDark ? (
            <motion.div
              key="dark-icon"
              initial={{ rotate: -25, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 25, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Moon className={`${iconSizeClasses} stroke-[2.2]`} />
            </motion.div>
          ) : (
            <motion.div
              key="light-icon"
              initial={{ rotate: 25, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -25, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sun className={`${iconSizeClasses} stroke-[2.2]`} />
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

export { CinematicThemeSwitcher };
