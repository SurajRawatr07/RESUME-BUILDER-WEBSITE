import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface InitialLoadingScreenProps {
  onComplete: () => void;
}

/**
 * InitialLoadingScreen
 *
 * Premium, minimal, cinematic fullscreen intro loader for "Resume Craft":
 * - Visible for EXACTLY 3 SECONDS (3000ms).
 * - Timed sequence:
 *     0–700ms: Resume Craft brand fades in with subtle upward motion.
 *     700–2200ms: Brand remains stable; subtext ("Crafting your experience...") gently fades in.
 *     2200–3000ms: Content gently fades out as progress reaches 100%.
 *     3000ms: Loader triggers onComplete, exiting smoothly over 350ms to reveal the main site.
 * - Theme-aware: #FFFFFF surface in light mode, #111111 in dark mode.
 * - Perfectly centered handwritten brand script in font-weight 700.
 * - Thin horizontal progress line (0% -> 100%) with low-opacity neutral track.
 * - 100vw x 100vh fullscreen layout, zero horizontal scroll, responsive across 320px–1920px.
 * - Supports prefers-reduced-motion.
 */
export default function InitialLoadingScreen({
  onComplete,
}: InitialLoadingScreenProps) {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Exactly 3000ms timer with reliable cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      id="resume-craft-initial-loader"
      role="status"
      aria-label="Loading Resume Craft"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : -6,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center w-screen h-screen min-h-[100dvh] overflow-hidden select-none px-6 transition-colors duration-200 ${
        isDark ? "bg-[#111111] text-white" : "bg-[#FFFFFF] text-[#111111]"
      }`}
    >
      {/* Centered Content Wrapper with 2200–3000ms gentle exit fade */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { opacity: [0, 1, 1, 0] }
            : {
                opacity: [0, 1, 1, 0],
                y: [8, 0, 0, -4],
              }
        }
        transition={{
          duration: 3.0,
          times: [0, 0.23, 0.74, 1.0], // 0s->0.7s (fade in), 0.7s->2.2s (stable), 2.2s->3.0s (soft fade out)
          ease: "easeInOut",
        }}
        className="flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto"
      >
        {/* 1. Resume Craft Brand Wordmark */}
        <h1
          id="loading-brand-wordmark"
          className="brand-wordmark whitespace-nowrap select-none font-bold tracking-normal text-[26px] xs:text-[28px] sm:text-[34px] md:text-[38px] lg:text-[40px] leading-tight text-center"
          style={{
            fontFamily:
              "'Alex Brush', 'Allura', cursive, 'Brush Script MT', -apple-system, sans-serif",
            fontWeight: 700,
          }}
        >
          Resume Craft
        </h1>

        {/* 2. Subtext: "Crafting your experience..." in standard typography */}
        <motion.p
          id="loading-subtext"
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.7,
            duration: 0.5,
            ease: "easeOut",
          }}
          className={`mt-2.5 sm:mt-3 text-[12.5px] xs:text-[13px] sm:text-[13.5px] md:text-[14px] font-normal tracking-normal select-none ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          Crafting your experience...
        </motion.p>

        {/* 3. Subtle Horizontal Progress Line (0% -> 100% over approximately 3s) */}
        <div
          id="loading-progress-track"
          className={`mt-6 sm:mt-7 h-[2px] w-[140px] xs:w-[160px] sm:w-[200px] md:w-[220px] rounded-full overflow-hidden ${
            isDark ? "bg-white/[0.12]" : "bg-black/[0.08]"
          }`}
          aria-hidden="true"
        >
          <motion.div
            id="loading-progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3.0,
              ease: "linear",
            }}
            className={`h-full rounded-full ${
              isDark ? "bg-white" : "bg-[#111111]"
            }`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
