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
  FileText,
  LogIn,
  FilePlus,
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
  onNavigateToDashboard?: () => void;
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
 * Professional floating pill navbar for Resume Craft:
 * - Desktop: [ Resume Craft ] [ Home ] [ How It Works ] [ Templates ] [ Features ] ........ [ Profile ] [ Theme ]
 * - Mobile (< 768px): [ Resume Craft ] [ Theme ] [ ☰ ] with animated slide-down sheet
 * - Robust responsive flex layout: nav labels NEVER disappear, clip, or hide on desktop/tablet
 * - Responsive max-width: min(96vw, 1200px) on desktop; calc(100% - 24px) on mobile
 * - Compact profile dropdown (32–34px avatar, 13–14px name with graceful truncation)
 * - Zero yellow/gold or rainbow effects; clean dark & light mode styling
 */
export default function FloatingNavbar({
  navLinks,
  onStartBuilding,
  onNavigateToDashboard,
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
      className="fixed top-3 sm:top-4 lg:top-5 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 md:px-6 pointer-events-none"
    >
      {/* ─── Floating Nav Pill Bar ─── */}
      <motion.nav
        id="main-floating-navbar"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`pointer-events-auto relative isolate w-[calc(100%-24px)] md:w-[min(96vw,1200px)] max-w-[1200px] h-[50px] sm:h-[52px] lg:h-[56px] rounded-full transition-all duration-300 ease-out flex items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 ${
          scrolled
            ? isDark
              ? "bg-[#111111]/92 border border-white/[0.14] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              : "bg-white/92 border border-black/[0.09] shadow-[0_10px_28px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : isDark
            ? "bg-[#111111]/85 border border-white/[0.10] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.45)] backdrop-blur-md"
            : "bg-white/85 border border-black/[0.07] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md"
        }`}
        aria-label="Main Navigation"
      >
        {/* ─── Left Group: Brand Wordmark + Desktop Nav Items ─── */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-3.5 lg:gap-6 shrink-0 min-w-0">
          {/* 1. Brand Wordmark (Handwritten / Script Brand Typography) */}
          <div className="flex items-center shrink-0">
            <BrandWordmark
              id="floating-navbar-brand"
              size="md"
              onClick={() => handleNavClick("#home")}
              ariaLabel="Resume Craft Home"
            />
          </div>

          {/* 2. Desktop Navigation Items (Tablet & Desktop >= 768px: Icon + Text ALWAYS visible) */}
          <div
            className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0"
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
                  id={`nav-link-${sectionId}`}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  className={`relative px-2 sm:px-2.5 lg:px-3.5 py-1.5 rounded-full text-[13px] lg:text-[14px] font-medium transition-colors duration-150 flex items-center gap-1.5 select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 whitespace-nowrap shrink-0 ${
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
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 opacity-80" aria-hidden="true" />
                  <span className="whitespace-nowrap leading-none">{link.label}</span>

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
        </div>

        {/* ─── Right Group: [Profile] [Theme] [Mobile Menu Button (md:hidden)] ─── */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0 ml-auto pl-2">
          {/* Desktop/Tablet Profile Dropdown (Only shown when authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center shrink-0">
              <ProfileDropdown
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToDashboard={onNavigateToDashboard || (() => handleNavClick("#home"))}
                onNavigateToEditor={onStartBuilding}
              />
            </div>
          )}

          {/* Theme Toggle (Always visible in all viewports, clean and compact) */}
          <div className="flex items-center shrink-0">
            <CinematicThemeSwitcher size="navbar" />
          </div>

          {/* Mobile Menu Hamburger Button (Visible only on < 768px) */}
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${
              isDark
                ? "border-white/[0.12] text-neutral-200 hover:bg-white/[0.08]"
                : "border-black/[0.08] text-neutral-700 hover:bg-black/[0.05]"
            }`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Dropdown Menu Sheet (< 768px) ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            role="region"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto w-[calc(100vw-24px)] max-w-sm sm:max-w-md mt-2 rounded-2xl p-3 border transition-colors shadow-2xl backdrop-blur-2xl ${
              isDark
                ? "bg-[#111111]/95 border-white/[0.12] text-white"
                : "bg-white/95 border-black/[0.08] text-neutral-900"
            }`}
          >
            <div className="flex flex-col space-y-1">
              {/* All Navigation Links with Semantic Icons + Text Labels */}
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                const Icon = getNavIcon(link.href);

                return (
                  <button
                    key={link.label}
                    id={`mobile-nav-link-${sectionId}`}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className={`relative text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white font-semibold"
                          : "bg-black/[0.06] text-neutral-950 font-semibold"
                        : isDark
                        ? "text-neutral-400 hover:bg-white/5 hover:text-white"
                        : "text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-950"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">{link.label}</span>
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

              {/* Mobile Auth Actions (When Authenticated) */}
              {isAuthenticated && user && (
                <>
                  <div className={`my-1.5 h-px ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />

                  {/* User Profile Summary Card */}
                  <div className="px-3 py-2 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{user.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    {onNavigateToDashboard && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigateToDashboard();
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 opacity-70 shrink-0" />
                        <span>My Resumes</span>
                      </button>
                    )}

                    {onNavigateToProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigateToProfile();
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 shrink-0" />
                        <span>Profile & Account</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}

              {/* Mobile Actions (When Not Authenticated) */}
              {!isAuthenticated && (
                <>
                  <div className={`my-1.5 h-px ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`} />
                  <div className="flex flex-col gap-1.5 pt-1">
                    {onNavigateToLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigateToLogin();
                        }}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 opacity-70 shrink-0" />
                        <span>Log In</span>
                      </button>
                    )}
                    {onStartBuilding && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onStartBuilding();
                        }}
                        className="w-full text-center px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <FilePlus className="w-4 h-4 shrink-0" />
                        <span>Start Building Free</span>
                      </button>
                    )}
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
