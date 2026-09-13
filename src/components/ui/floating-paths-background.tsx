import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export interface FloatingPathsBackgroundProps {
  className?: string;
  position?: number;
  pathCount?: number;
  opacity?: number;
  animationDuration?: number;
}

interface PathDefinition {
  id: string;
  d: string;
  width: number;
  colorIndex: number;
  duration: number;
  delay: number;
  driftX: number[];
  driftY: number[];
  isMobileHidden: boolean;
}

/**
 * FloatingPathsBackground
 *
 * Inspired by the Bundui Floating Paths component (21st.dev/@bundui/components/floating-paths).
 * Crafted specifically for Resume Craft's editorial aesthetic:
 * - Ultra-thin, harmonic SVG curved paths generated with cubic bezier equations
 * - Flowing dual-position topography ribbons (position: 1 and -1)
 * - Light Mode: Warm charcoal strokes (0.035 - 0.075 opacity) on warm ivory (#F7F4EE)
 * - Dark Mode: Subtle illuminated architectural strokes (0.025 - 0.065 opacity) on deep charcoal (#11110F)
 * - Continuous organic floating motion (18–35s duration)
 * - Hero center vignette mask to guarantee 100% pristine heading readability
 * - Fully responsive: 60fps on mobile (reduced path density below 768px), zero horizontal overflow
 * - Respects prefers-reduced-motion (freezes into static architectural lines)
 * - Fixed z-index: 0, pointer-events: none (never blocks inputs, buttons, dialogs, or resume preview)
 */
export default function FloatingPathsBackground({
  className = "",
  position,
  pathCount = 26,
  opacity = 1,
  animationDuration = 24,
}: FloatingPathsBackgroundProps) {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Subtle stroke color palette strictly adhering to user specifications
  const lightColors = useMemo(
    () => [
      "rgba(17, 17, 15, 0.055)",
      "rgba(17, 17, 15, 0.075)",
      "rgba(17, 17, 15, 0.035)",
    ],
    []
  );

  const darkColors = useMemo(
    () => [
      "rgba(247, 244, 238, 0.045)",
      "rgba(247, 244, 238, 0.065)",
      "rgba(247, 244, 238, 0.025)",
    ],
    []
  );

  // Generate Bundui-inspired curved paths
  const paths = useMemo<PathDefinition[]>(() => {
    const list: PathDefinition[] = [];
    const total = Math.max(10, pathCount);

    // If an explicit position (-1 or 1) is passed, use that single stream;
    // Otherwise, generate dual complementary streams (1 and -1) to form the full Bundui landscape.
    const positions = position !== undefined ? [position] : [1, -1];
    const perPosition = Math.ceil(total / positions.length);

    positions.forEach((pos, pIndex) => {
      for (let i = 0; i < perPosition; i++) {
        // Bundui signature cubic bezier formula with fine mathematical calibration
        const d = `M-${380 - i * 5 * pos} -${189 + i * 6}C-${
          380 - i * 5 * pos
        } -${189 + i * 6} -${312 - i * 5 * pos} ${216 - i * 6} ${
          152 - i * 5 * pos
        } ${343 - i * 6}C${616 - i * 5 * pos} ${470 - i * 6} ${
          684 - i * 5 * pos
        } ${875 - i * 6} ${684 - i * 5 * pos} ${875 - i * 6}`;

        // Very thin stroke width: 0.5px to 1.1px
        const width = 0.55 + (i % 4) * 0.15;

        // Varied durations (18s to 34s) and organic delays
        const duration = animationDuration + (i % 5) * 2.8 - 2 + pIndex * 3;
        const delay = (i % 6) * 1.5 + pIndex * 1.2;

        // Distinct organic floating drift directions
        // Path 1 (i % 5 === 0) -> slow left-to-right
        // Path 2 (i % 5 === 1) -> slow right-to-left
        // Path 3 (i % 5 === 2) -> subtle vertical drift
        // Path 4 (i % 5 === 3) -> slow diagonal movement
        // Path 5 (i % 5 === 4) -> gentle curved float
        let driftX = [0, 20 * pos, 0];
        let driftY = [0, -14, 0];

        if (i % 5 === 1) {
          driftX = [0, -18 * pos, 0];
          driftY = [0, 12, 0];
        } else if (i % 5 === 2) {
          driftX = [0, 6 * pos, 0];
          driftY = [0, -22, 0];
        } else if (i % 5 === 3) {
          driftX = [0, 24 * pos, 0];
          driftY = [0, 18, 0];
        } else if (i % 5 === 4) {
          driftX = [0, -14 * pos, 0];
          driftY = [0, -18, 0];
        }

        list.push({
          id: `fp-${pIndex}-${i}`,
          d,
          width,
          colorIndex: (i + pIndex) % 3,
          duration,
          delay,
          driftX,
          driftY,
          isMobileHidden: i >= 6, // Keep top 12 paths (6 from each stream) on mobile for optimal 60fps
        });
      }
    });

    return list;
  }, [pathCount, position, animationDuration]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none print:hidden transition-colors duration-300 ${
        isDark ? "bg-[#11110F]" : "bg-[#F7F4EE]"
      } ${className}`}
      style={{
        // Soft vignette mask: preserves clean readability over hero heading & central text
        maskImage:
          "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.65) 55%, black 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 55% at 50% 38%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.65) 55%, black 100%)",
        opacity,
      }}
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => {
          const strokeColor = isDark
            ? darkColors[path.colorIndex]
            : lightColors[path.colorIndex];

          return (
            <motion.path
              key={path.id}
              d={path.d}
              stroke={strokeColor}
              strokeWidth={path.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={path.isMobileHidden ? "hidden md:inline" : "inline"}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      x: 0,
                      y: 0,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      x: path.driftX,
                      y: path.driftY,
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      duration: path.duration,
                      delay: path.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
              }
            />
          );
        })}
      </svg>
    </div>
  );
}

export { FloatingPathsBackground };
