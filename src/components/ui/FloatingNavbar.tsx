import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, ArrowRight, LogOut, User } from "lucide-react";
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

export default function FloatingNavbar({
  navLinks,
  onStartBuilding,
  onNavigateToProfile,
  onNavigateToLogin,
  onScrollTo,
}: FloatingNavbarProps) {
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

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
      {/* ─── Main Floating Navbar Pill Container (21st.dev inspired) ─── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`pointer-events-auto relative isolate w-full max-w-5xl rounded-full transition-all duration-300 ease-out flex items-center justify-between px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 ${
          scrolled
            ? isDark
              ? "bg-[#111111]/95 border border-white/[0.12] shadow-[0_12px_35px_-4px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
              : "bg-white/95 border border-black/[0.08] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
            : isDark
            ? "bg-[#111111]/85 border border-white/[0.08] shadow-[0_4px_25px_-4px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "bg-white/85 border border-black/[0.06] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl"
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

        {/* ─── 2. Desktop Navigation Links (Exact order: Home → How It Works → Templates → Features) ─── */}
        <div className="hidden lg:flex items-center gap-1 md:gap-1.5 mx-2">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out select-none cursor-pointer ${
                  isActive
                    ? isDark
                      ? "text-white bg-white/[0.14] shadow-xs"
                      : "text-gray-950 bg-black/[0.07] shadow-xs"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5 active:translate-y-0"
                    : "text-gray-600 hover:text-gray-950 hover:bg-black/[0.04] hover:-translate-y-0.5 active:translate-y-0"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* ─── 3. Right Controls: Theme Toggle + Auth / Profile + Create Resume ─── */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
          {/* Theme Toggle (Cinematic Theme Switcher) */}
          <div className="flex items-center shrink-0">
            <CinematicThemeSwitcher size="navbar" />
          </div>

          {/* Authentication State */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <ProfileDropdown
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToDashboard={() => handleNavClick("#home")}
                onNavigateToEditor={() => onStartBuilding()}
              />
              <button
                onClick={() => onStartBuilding()}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-xs hover:shadow-indigo-500/25 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onNavigateToLogin || (() => onStartBuilding())}
                className={`rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/[0.08]"
                    : "text-gray-700 hover:text-gray-950 hover:bg-black/[0.05]"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onStartBuilding()}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4.5 py-1.5 sm:py-2 shadow-xs hover:shadow-indigo-500/25 transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <span>Create Resume</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
              isDark
                ? "border-gray-800 text-gray-200 hover:bg-gray-800/60"
                : "border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile Floating Dropdown Sheet ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto w-full max-w-5xl mt-2 rounded-2xl p-3 sm:p-4 border transition-colors shadow-2xl backdrop-blur-2xl ${
              isDark
                ? "bg-[#111111]/95 border-white/[0.12] text-white"
                : "bg-white/95 border-black/[0.08] text-gray-900"
            }`}
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white font-semibold"
                          : "bg-black/5 text-gray-950 font-semibold"
                        : isDark
                        ? "text-gray-300 hover:bg-white/5 hover:text-white"
                        : "text-gray-700 hover:bg-black/5 hover:text-gray-950"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                  </button>
                );
              })}

              <div className={`my-2 h-px ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />

              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
                <div className="space-y-1">
                  {onNavigateToProfile && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigateToProfile();
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors flex items-center gap-2 cursor-pointer"
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
                    isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-black/5"
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
                className="w-full mt-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm py-2.5 px-4 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
