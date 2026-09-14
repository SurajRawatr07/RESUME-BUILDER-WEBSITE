import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Layers,
  LayoutTemplate,
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import CinematicThemeSwitcher from "@/components/ui/CinematicThemeSwitcher";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import BrandWordmark from "@/components/ui/BrandWordmark";
import { TemplateType } from "@/types/resume";

export interface NavLinkItem {
  label: string;
  href: string;
}

interface FloatingNavbarProps {
  navLinks: NavLinkItem[];
  onStartBuilding?: (templateId?: TemplateType) => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  onScrollTo?: (id: string) => void;
}

/**
 * Resolves a semantic Lucide icon for each navigation section
 */
const getNavIcon = (href: string): LucideIcon => {
  const id = href.replace("#", "").toLowerCase();
  switch (id) {
    case "home":
      return Home;
    case "how-it-works":
      return Layers;
    case "templates":
      return LayoutTemplate;
    case "features":
      return Sparkles;
    default:
      return Home;
  }
};

/**
 * FloatingNavbar
 *
 * Inspired by Ruixen UI Floating Nav (21st.dev/@ruixen.ui/components/floating-nav):
 * - Floating pill-shaped container with subtle elevation and glass backdrop
 * - Centered layout with balanced horizontal padding
 * - Smooth Framer Motion spring active-pill background transition
 * - Minimalist icon + text navigation with subtle hover states
 * - Compact futuristic/geometric "Resume Craft" branding
 * - Sized theme switcher with Sun/Moon icons (no yellow/gold accents)
 * - Truly responsive mobile layout: [ Resume Craft ] [ Theme ] [ Menu ]
 * - Fully accessible keyboard navigation and prefers-reduced-motion support
 */
export default function FloatingNavbar({
  navLinks,
  onStartBuilding,
  onNavigateToProfile,
  onScrollTo,
}: FloatingNavbarProps) {
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll detection for active section and elevated glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section based on scroll position
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (onScrollTo) {
      onScrollTo(href);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-3 sm:top-5 lg:top-6 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 md:px-6 pointer-events-none"
    >
      {/* ─── Floating Nav Pill Bar ─── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`pointer-events-auto relative isolate w-full max-w-[calc(100vw-24px)] xs:max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-[48px] sm:h-[52px] lg:h-[54px] rounded-full transition-all duration-300 ease-out flex items-center justify-between px-3.5 sm:px-4 lg:px-5 ${
          scrolled
            ? isDark
              ? "bg-[#111111]/90 border border-white/[0.14] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "bg-white/90 border border-black/[0.09] shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : isDark
            ? "bg-[#111111]/80 border border-white/[0.10] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "bg-white/80 border border-black/[0.07] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md"
        }`}
        aria-label="Main Navigation"
      >
        {/* ─── 1. Brand Wordmark (Signature / Calligraphic Script Typography, Compact) ─── */}
        <div className="flex items-center shrink-0">
          <BrandWordmark
            id="floating-navbar-brand"
            size="md"
            onClick={() => handleNavClick("#home")}
            ariaLabel="Resume Craft Home"
          />
        </div>

        {/* ─── 2. Center Floating Navigation Items (Desktop & Tablet >= 768px) ─── */}
        <div
          className="hidden md:flex items-center gap-0.5 lg:gap-1 md:absolute md:left-1/2 md:-translate-x-1/2"
          onMouseLeave={() => setHoveredSection(null)}
        >
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            const isHovered = hoveredSection === sectionId;
            const Icon = getNavIcon(link.href);

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                onMouseEnter={() => setHoveredSection(sectionId)}
                className={`relative px-2.5 lg:px-3 py-1.5 rounded-full text-[13px] lg:text-[14px] font-medium transition-colors duration-200 flex items-center gap-1.5 select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${
                  isActive
                    ? isDark
                      ? "text-white font-semibold"
                      : "text-neutral-950 font-semibold"
                    : isDark
                    ? "text-neutral-400 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 opacity-80" />
                <span className="whitespace-nowrap">{link.label}</span>

                {/* Shared Active Pill Indicator (Smooth spring transition) */}
                {isActive && (
                  <motion.div
                    layoutId="floatingNavActiveIndicator"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }
                    }
                    className={`absolute inset-0 w-full rounded-full -z-10 ${
                      isDark ? "bg-white/[0.12]" : "bg-black/[0.06]"
                    }`}
                  />
                )}

                {/* Subtle Hover Backdrop when not active */}
                {!isActive && isHovered && (
                  <motion.div
                    layoutId="floatingNavHoverIndicator"
                    transition={{ duration: 0.15 }}
                    className={`absolute inset-0 w-full rounded-full -z-10 ${
                      isDark ? "bg-white/[0.05]" : "bg-black/[0.03]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── 3. Right Controls: Profile (if authenticated) + Theme Switcher + Mobile Menu Trigger ─── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop/Tablet Authentication Profile Dropdown (Only if logged in) */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center">
              <ProfileDropdown
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToDashboard={() => handleNavClick("#home")}
                onNavigateToEditor={onStartBuilding}
              />
            </div>
          )}

          {/* Theme Toggle (Compact navbar size, no yellow/gold) */}
          <div className="flex items-center shrink-0">
            <CinematicThemeSwitcher size="navbar" />
          </div>

          {/* Mobile Menu Trigger Button (Compact rounded icon button) */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer flex items-center justify-center ${
              isDark
                ? "border-white/[0.12] text-neutral-200 hover:bg-white/[0.08]"
                : "border-black/[0.08] text-neutral-700 hover:bg-black/[0.05]"
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Glass Dropdown Sheet (Ruixen UI Style) ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto w-[calc(100vw-24px)] max-w-sm sm:max-w-md mt-2 rounded-2xl p-3 border transition-colors shadow-2xl backdrop-blur-2xl ${
              isDark
                ? "bg-[#111111]/95 border-white/[0.12] text-white"
                : "bg-white/95 border-black/[0.08] text-neutral-900"
            }`}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                const Icon = getNavIcon(link.href);

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`relative text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white font-semibold"
                          : "bg-black/[0.06] text-neutral-950 font-semibold"
                        : isDark
                        ? "text-neutral-400 hover:bg-white/5 hover:text-white"
                        : "text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-80" />
                      <span>{link.label}</span>
                    </div>

                    {isActive && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDark ? "bg-white" : "bg-neutral-900"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Mobile Auth Actions (Only if authenticated) */}
              {isAuthenticated && (
                <>
                  <div className={`my-1.5 h-px ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />
                  <div className="space-y-1">
                    {onNavigateToProfile && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigateToProfile();
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>{user?.name ? `${user.name} — Profile` : "My Account Profile"}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
