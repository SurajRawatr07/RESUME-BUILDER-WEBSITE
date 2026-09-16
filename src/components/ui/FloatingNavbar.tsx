import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Home,
  Layers,
  LayoutTemplate,
  Sparkles,
  HelpCircle,
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
    case "templates":
      return LayoutTemplate;
    case "how-it-works":
      return Layers;
    case "features":
      return Sparkles;
    case "faq":
      return HelpCircle;
    default:
      return Home;
  }
};

/**
 * FloatingNavbar
 *
 * Premium SaaS floating navigation pill:
 * - Desktop (>= 768px):
 *   [ Resume Craft ] [ Home ] [ Templates ] [ How It Works ] [ FAQ ] [ Theme ]
 *   Content-based width (not stretched), height 54–56px, rounded 18–20px.
 *   Controlled flex layout with balanced spacing:
 *   Brand → nav: 18–24px, Between nav items: 6–12px, Nav item padding: 10–14px × 8–10px.
 *   FAQ → Theme toggle: 6–10px.
 * - Mobile (< 768px):
 *   [ Resume Craft ] [ Theme ] [ Menu ]
 *   Width: calc(100vw - 24px), height 50px, no overflow, brand never wraps.
 *   Smooth compact dropdown menu sheet with full readable navigation links.
 * - Strict palette:
 *   Light: #FFFFFF surface, #111111 text, rgba(17,17,17,0.10) border
 *   Dark:  #111111 surface, #FFFFFF text, rgba(255,255,255,0.12) border
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

  // Desktop navigation links matching the requested SaaS visual hierarchy:
  // [ Resume Craft ] [ Home ] [ Templates ] [ How It Works ] [ FAQ ] [ Theme ]
  const desktopNavLinks: NavLinkItem[] = useMemo(() => {
    return [
      { label: "Home", href: "#home" },
      { label: "Templates", href: "#templates" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ];
  }, []);

  // Mobile navigation links includes all core landing page sections
  const mobileNavLinks: NavLinkItem[] = useMemo(() => {
    return [
      { label: "Home", href: "#home" },
      { label: "Templates", href: "#templates" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ];
  }, []);

  // Scroll detection for active section and elevated glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sectionIds = ["home", "templates", "how-it-works", "features", "faq"];
      const scrollPosition = window.scrollY + 160;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
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
  }, []);

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
      className="fixed top-3 sm:top-3.5 lg:top-4 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none"
    >
      {/* ─── Floating Nav Pill Bar ─── */}
      <motion.nav
        id="main-floating-navbar"
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`pointer-events-auto relative isolate transition-all duration-200 ease-out flex items-center
          /* Mobile (< 768px): full width minus 24px, compact 48–50px height, 6–8px padding */
          w-[calc(100vw-24px)] max-w-none h-[50px] rounded-[16px] px-2.5
          /* Tablet & Desktop (>= 768px): content-based width, horizontally centered, height 54–56px, rounded 18–20px */
          md:w-fit md:max-w-[1120px] md:h-[54px] lg:h-[56px] md:rounded-[18px] lg:rounded-[20px] md:px-3 lg:px-3.5
          ${
            isDark
              ? "bg-[#111111] text-white border border-[rgba(255,255,255,0.12)] shadow-[0_4px_24px_-2px_rgba(0,0,0,0.65)] backdrop-blur-md"
              : "bg-[#FFFFFF] text-[#111111] border border-[rgba(17,17,17,0.10)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] backdrop-blur-md"
          }`}
        aria-label="Main Navigation"
      >
        {/* ─── MOBILE VIEW (< 768px): [ Resume Craft ] [ Theme ] [ Menu ] ─── */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Brand Wordmark (Left, whitespace-nowrap, no wrap) */}
          <div className="flex items-center shrink-0 pl-0.5">
            <BrandWordmark
              id="floating-navbar-brand-mobile"
              size="md"
              onClick={() => handleNavClick("#home")}
              ariaLabel="Resume Craft Home"
            />
          </div>

          {/* Right Controls: [ Theme ] [ Menu ] */}
          <div className="flex items-center gap-2 shrink-0 pr-0.5">
            <div className="flex items-center shrink-0">
              <CinematicThemeSwitcher size="navbar" />
            </div>

            <button
              id="mobile-nav-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-[32px] h-[32px] rounded-full border transition-colors cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${
                isDark
                  ? "border-[rgba(255,255,255,0.12)] text-white hover:bg-white/[0.08]"
                  : "border-[rgba(17,17,17,0.10)] text-[#111111] hover:bg-black/[0.05]"
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
        </div>

        {/* ─── DESKTOP & TABLET VIEW (>= 768px): Compact cohesive floating pill ─── */}
        <div className="hidden md:flex items-center shrink-0">
          {/* 1. Brand Wordmark (Resume Craft: 18–21px, bold weight 700; Brand → nav: 18–24px) */}
          <div className="flex items-center shrink-0 mr-4.5 lg:mr-5">
            <BrandWordmark
              id="floating-navbar-brand"
              size="md"
              onClick={() => handleNavClick("#home")}
              ariaLabel="Resume Craft Home"
            />
          </div>

          {/* 2. Desktop Navigation Items: 6–12px gap, 10–14px px, 8–10px py, 10–12px rounded */}
          <div
            className="flex items-center gap-1.5 lg:gap-2 shrink-0"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {desktopNavLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              const isHovered = hoveredSection === sectionId;

              return (
                <button
                  key={link.label}
                  id={`nav-link-${sectionId}`}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  className={`relative px-3 lg:px-3.5 py-2 rounded-[10px] text-[13.5px] lg:text-[14px] leading-none transition-colors duration-180 flex items-center justify-center select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark
                        ? "text-white font-semibold"
                        : "text-[#111111] font-semibold"
                      : isDark
                      ? "text-neutral-400 hover:text-white font-medium"
                      : "text-neutral-600 hover:text-[#111111] font-medium"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="whitespace-nowrap">{link.label}</span>

                  {/* Active Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="floatingNavActivePill"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 400,
                              damping: 32,
                            }
                      }
                      className={`absolute inset-0 w-full rounded-[10px] -z-10 ${
                        isDark ? "bg-white/[0.10]" : "bg-black/[0.06]"
                      }`}
                    />
                  )}

                  {/* Subtle Hover Backdrop when not active */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="floatingNavHoverPill"
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={`absolute inset-0 w-full rounded-[10px] -z-10 ${
                        isDark ? "bg-white/[0.05]" : "bg-black/[0.03]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Controls Group: Profile Dropdown (if authenticated) + Theme Toggle (margin-left: 6–10px) */}
          <div className="flex items-center shrink-0 ml-2 lg:ml-2.5 gap-2">
            {isAuthenticated && (
              <div className="flex items-center shrink-0">
                <ProfileDropdown
                  onNavigateToProfile={onNavigateToProfile}
                  onNavigateToDashboard={onNavigateToDashboard || (() => handleNavClick("#home"))}
                  onNavigateToEditor={onStartBuilding}
                />
              </div>
            )}

            {/* Theme Toggle: compact 38–44px wide × 28–32px high */}
            <div className="flex items-center shrink-0">
              <CinematicThemeSwitcher size="navbar" />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Mobile Dropdown Menu Sheet (< 768px) ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            role="region"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`pointer-events-auto w-[calc(100vw-24px)] max-w-sm sm:max-w-md mt-2 rounded-[18px] p-3 border transition-colors shadow-2xl backdrop-blur-xl ${
              isDark
                ? "bg-[#111111] border-[rgba(255,255,255,0.12)] text-white"
                : "bg-[#FFFFFF] border-[rgba(17,17,17,0.10)] text-[#111111]"
            }`}
          >
            <div className="flex flex-col space-y-1">
              {/* Navigation Links with Semantic Icons + Full Readable Text Labels */}
              {mobileNavLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                const Icon = getNavIcon(link.href);

                return (
                  <button
                    key={link.label}
                    id={`mobile-nav-link-${sectionId}`}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className={`relative text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white font-semibold"
                          : "bg-black/[0.06] text-[#111111] font-semibold"
                        : isDark
                        ? "text-neutral-400 hover:bg-white/5 hover:text-white"
                        : "text-neutral-600 hover:bg-black/[0.04] hover:text-[#111111]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">{link.label}</span>
                    </div>

                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDark ? "bg-white" : "bg-[#111111]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              {/* Mobile Auth Actions (When Authenticated) */}
              {isAuthenticated && user && (
                <>
                  <div
                    className={`my-1.5 h-px ${
                      isDark ? "bg-neutral-800" : "bg-neutral-100"
                    }`}
                  />

                  {/* User Profile Summary */}
                  <div className="px-3 py-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/60 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shrink-0 shadow-xs">
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
                      <p className="text-xs font-semibold text-[#111111] dark:text-white truncate">
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
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 opacity-70 shrink-0" />
                        <span>Profile & Account</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2.5 cursor-pointer"
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
                  <div
                    className={`my-1.5 h-px ${
                      isDark ? "bg-neutral-800" : "bg-neutral-100"
                    }`}
                  />
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
                        className="w-full text-center px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
