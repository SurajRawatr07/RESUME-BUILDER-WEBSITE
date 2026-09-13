import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Layers,
  LayoutTemplate,
  Sparkles,
  Menu,
  X,
  LogIn,
  ArrowRight,
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
  onStartBuilding: (templateId?: TemplateType) => void;
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

export default function FloatingNavbar({
  navLinks,
  onStartBuilding,
  onNavigateToProfile,
  onNavigateToLogin,
  onScrollTo,
}: FloatingNavbarProps) {
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll detection for floating elevation and active section
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
    handleScroll(); // Initial check
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
      className="fixed top-2.5 sm:top-4 md:top-5 inset-x-0 z-50 flex flex-col items-center px-2.5 sm:px-4 md:px-6 pointer-events-none"
    >
      {/* ─── Main Floating Navbar Pill Container (Tubelight Navbar Design) ─── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`pointer-events-auto relative isolate w-full max-w-5xl rounded-full transition-all duration-300 ease-out flex items-center justify-between px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 ${
          scrolled
            ? isDark
              ? "bg-[#111111]/92 border border-white/[0.12] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.65)] backdrop-blur-xl"
              : "bg-white/92 border border-black/[0.08] shadow-[0_10px_28px_-4px_rgba(0,0,0,0.07)] backdrop-blur-xl"
            : isDark
            ? "bg-[#111111]/85 border border-white/[0.09] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.45)] backdrop-blur-lg"
            : "bg-white/85 border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] backdrop-blur-lg"
        }`}
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
        aria-label="Main Navigation"
      >
        {/* ─── 1. Brand Wordmark (TEXT ONLY, NO ICON) ─── */}
        <div className="flex items-center shrink-0 pr-1.5 sm:pr-3">
          <BrandWordmark
            size="md"
            onClick={() => handleNavClick("#home")}
            ariaLabel="Resume Craft Home"
          />
        </div>

        {/* ─── 2. Center Tubelight Navigation Items (Desktop & Tablet) ─── */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 relative">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            const Icon = getNavIcon(link.href);

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${
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
                <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{link.label}</span>

                {/* Tubelight Lamp Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="tubelightLamp"
                    initial={false}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 320,
                            damping: 28,
                          }
                    }
                    className={`absolute inset-0 w-full rounded-full -z-10 ${
                      isDark ? "bg-white/[0.12]" : "bg-black/[0.06]"
                    }`}
                  >
                    {/* Small Lamp Bar at Top of Active Tab */}
                    <div
                      className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full ${
                        isDark ? "bg-white" : "bg-neutral-900"
                      }`}
                    >
                      {/* Subtle Soft Glow Layers (Strictly neutral monochrome, no yellow/gold) */}
                      <div
                        className={`absolute w-12 h-5 rounded-full blur-md -top-2 -left-2 pointer-events-none ${
                          isDark ? "bg-white/20" : "bg-neutral-900/15"
                        }`}
                      />
                      <div
                        className={`absolute w-8 h-4 rounded-full blur-sm -top-1 pointer-events-none ${
                          isDark ? "bg-white/25" : "bg-neutral-900/20"
                        }`}
                      />
                      <div
                        className={`absolute w-4 h-3 rounded-full blur-xs top-0 left-2 pointer-events-none ${
                          isDark ? "bg-white/30" : "bg-neutral-900/25"
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── 3. Right Controls: Sized Theme Switcher + Auth / Profile + CTA ─── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle (Cinematic Switcher, resized specifically for navbar) */}
          <div className="flex items-center shrink-0">
            <CinematicThemeSwitcher size="navbar" />
          </div>

          {/* Desktop Authentication & Action Buttons */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <ProfileDropdown
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToDashboard={() => handleNavClick("#home")}
                onNavigateToEditor={() => onStartBuilding()}
              />
              <button
                onClick={() => onStartBuilding()}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onNavigateToLogin || (() => onStartBuilding())}
                className={`rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "text-neutral-300 hover:text-white hover:bg-white/[0.08]"
                    : "text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05]"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onStartBuilding()}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <span>Create Resume</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger Button (Clean, compact, no horizontal overflow) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
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

      {/* ─── Mobile Glass Dropdown Sheet (With Tubelight Style Items) ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto w-full max-w-5xl mt-2 rounded-2xl p-3 sm:p-4 border transition-colors shadow-2xl backdrop-blur-2xl ${
              isDark
                ? "bg-[#111111]/95 border-white/[0.12] text-white"
                : "bg-white/95 border-black/[0.08] text-neutral-900"
            }`}
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
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
                          className={`w-2 h-1 rounded-full ${
                            isDark ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" : "bg-neutral-900 shadow-[0_0_8px_rgba(0,0,0,0.4)]"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}

              <div className={`my-2 h-px ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />

              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
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
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateToLogin) onNavigateToLogin();
                    else onStartBuilding();
                  }}
                  className={`text-left px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark ? "text-neutral-300 hover:bg-white/5" : "text-neutral-700 hover:bg-black/5"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Primary Mobile CTA Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartBuilding();
                }}
                className="w-full mt-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium text-sm py-2.5 px-4 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
