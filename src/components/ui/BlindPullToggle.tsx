import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const SLATS = 6;

interface BlindPullToggleProps {
  size?: number;
  className?: string;
}

export default function BlindPullToggle({
  size = 34,
  className = "",
}: BlindPullToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const [displayDark, setDisplayDark] = useState(isDark);
  const [animating, setAnimating] = useState(false);
  const [scope, animate] = useAnimate();
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  // Sync external theme changes when not animating
  useEffect(() => {
    if (!animating) {
      setDisplayDark(isDark);
    }
  }, [isDark, animating]);

  const radius = Math.round(size * 0.26);
  const iconSize = Math.round(size * 0.44);
  const cordRestH = Math.max(10, Math.round(size * 0.32));
  const pullH = Math.round(size * 0.65);
  const dotWidth = Math.max(6, Math.round(size * 0.17));
  const dotHeight = Math.max(8, Math.round(size * 0.22));

  // Visual styling parameters matching 21st.dev reference
  const buttonBg = displayDark
    ? "linear-gradient(145deg, #1f2937, #111827)"
    : "linear-gradient(145deg, #ffffff, #f1f5f9)";

  const buttonBorder = displayDark
    ? "1.5px solid rgba(255, 255, 255, 0.12)"
    : "1.5px solid rgba(0, 0, 0, 0.12)";

  const buttonShadow = displayDark
    ? "0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
    : "0 3px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)";

  const iconColor = displayDark ? "#f3f4f6" : "#0f172a";

  const cordTop = displayDark
    ? "rgba(255, 255, 255, 0.4)"
    : "rgba(0, 0, 0, 0.32)";

  const cordBottom = displayDark
    ? "rgba(255, 255, 255, 0.15)"
    : "rgba(0, 0, 0, 0.12)";

  const dotBg = displayDark
    ? "linear-gradient(140deg, #94a3b8, #475569)"
    : "linear-gradient(140deg, #64748b, #334155)";

  const dotShadow = displayDark
    ? "0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
    : "0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)";

  const handleToggle = useCallback(async () => {
    if (animating) return;
    setAnimating(true);

    // 1. Pull the cord downwards
    await animate(
      ".cord-line",
      { height: pullH },
      { duration: 0.11, ease: [0.4, 0, 0.6, 1] }
    );

    // 2. Spring the cord back to resting height
    animate(
      ".cord-line",
      { height: cordRestH },
      { type: "spring", stiffness: 360, damping: 16 }
    );

    // 3. Subtle physical spring on the handle
    animate(
      ".cord-handle",
      { y: [0, -2, 0], rotate: [0, 8, -6, 2, 0] },
      { duration: 0.45, ease: "easeOut" }
    );

    // 4. Venetian blind slats collapse (simulating slats turning edge-on)
    await animate(
      ".slat",
      { scaleY: 0 },
      {
        delay: stagger(0.025, { from: "last" }),
        duration: 0.1,
        ease: "easeIn",
      }
    );

    // 5. Flip the theme and icon
    const nextDark = !displayDark;
    setDisplayDark(nextDark);
    toggleTheme();

    // 6. Venetian blind slats expand back open with stagger
    await animate(
      ".slat",
      { scaleY: 1 },
      {
        delay: stagger(0.028),
        duration: 0.13,
        ease: "easeOut",
      }
    );

    setAnimating(false);
  }, [animating, animate, pullH, cordRestH, displayDark, toggleTheme]);

  // Touch drag pull support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaY = e.changedTouches[0].clientY - startYRef.current;
    if (deltaY > 10 || Math.abs(deltaY) < 5) {
      handleToggle();
    }
  };

  return (
    <div
      ref={scope}
      className={`inline-flex flex-col items-center select-none ${className}`}
      style={{ minWidth: size }}
    >
      {/* Interactive Venetian Blind Frame */}
      <motion.button
        type="button"
        role="button"
        tabIndex={0}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          border: buttonBorder,
          boxShadow: buttonShadow,
          background: "transparent",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius - 1,
            overflow: "hidden",
          }}
        >
          {Array.from({ length: SLATS }).map((_, i) => {
            const topPx = Math.round((i / SLATS) * size);
            const nextTopPx =
              i === SLATS - 1 ? size : Math.round(((i + 1) / SLATS) * size);
            const heightPx = nextTopPx - topPx;

            return (
              <div
                key={i}
                className="slat"
                style={{
                  position: "absolute",
                  top: topPx,
                  left: 0,
                  width: "100%",
                  height: heightPx,
                  overflow: "hidden",
                  transformOrigin: "50% 50%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -topPx,
                    left: 0,
                    width: size,
                    height: size,
                    background: buttonBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: iconColor,
                  }}
                >
                  {displayDark ? (
                    <Moon
                      style={{ width: iconSize, height: iconSize }}
                      className="stroke-[1.8]"
                    />
                  ) : (
                    <Sun
                      style={{ width: iconSize, height: iconSize }}
                      className="stroke-[1.8]"
                    />
                  )}
                </div>

                {/* Subtle horizontal louver slit between blind slats */}
                {i < SLATS - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: 1,
                      backgroundColor: displayDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.button>

      {/* Hanging Pull Cord & Handle (21st.dev Blind Pull Style) */}
      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={handleToggle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        title={isDark ? "Pull to switch to light mode" : "Pull to switch to dark mode"}
        style={{ marginTop: -1 }}
      >
        {/* String eyelet mounting point */}
        <div
          style={{
            width: 4,
            height: 2,
            borderRadius: "1px 1px 0 0",
            backgroundColor: displayDark
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.25)",
          }}
        />

        {/* Cord Line */}
        <div
          className="cord-line transition-colors"
          style={{
            width: 1.5,
            height: cordRestH,
            background: `linear-gradient(to bottom, ${cordTop}, ${cordBottom})`,
            borderRadius: 1,
          }}
        />

        {/* Tassel / Pull Handle */}
        <motion.div
          className="cord-handle"
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          style={{
            width: dotWidth,
            height: dotHeight,
            borderRadius: "2px 2px 4px 4px",
            background: dotBg,
            boxShadow: dotShadow,
          }}
        />
      </div>
    </div>
  );
}
