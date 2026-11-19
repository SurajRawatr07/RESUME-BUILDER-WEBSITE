import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Github,
  Linkedin,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import BrandWordmark from "@/components/ui/BrandWordmark";
import CinematicThemeSwitcher from "@/components/ui/CinematicThemeSwitcher";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import { TemplateType } from "@/types/resume";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

export interface HeaderProps {
  navigationData: NavigationSection[];
  className?: string;
  onStartBuilding?: (templateId?: TemplateType) => void;
  onNavigateToLogin?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToProfile?: () => void;
  onScrollTo?: (href: string) => void;
}

const HeaderActionPill = ({
  label = "Create Resume",
  onClick,
  className,
  id,
}: {
  label?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}) => (
  <Button
    id={id}
    type="button"
    onClick={onClick}
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-4 w-fit overflow-hidden cursor-pointer shrink-0",
      className
    )}
  >
    <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
      {label}
    </span>
    <span className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </span>
  </Button>
);

const Header = ({
  navigationData,
  className,
  onStartBuilding,
  onNavigateToDashboard,
  onNavigateToProfile,
  onScrollTo,
}: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const currentYear = new Date().getFullYear();

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);

    const sectionIds = navigationData.map((item) => item.href.replace("#", ""));
    const scrollPos = window.scrollY + 160;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const id = sectionIds[i];
      if (!id) continue;
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop) {
        setActiveSection(id);
        break;
      }
    }
  }, [navigationData]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace("#", "");
      setActiveSection(id);
      setIsOpen(false);
      if (onScrollTo) {
        onScrollTo(href);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      id="hero-01-header"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-3 sm:px-4 flex items-center justify-center sticky top-0 h-20",
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center h-fit justify-between gap-2.5 lg:gap-4 transition-all duration-500",
          sticky
            ? "px-3.5 py-2 sm:p-2.5 bg-background/75 backdrop-blur-lg border border-border/50 shadow-2xl shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent"
        )}
      >
        {/* Logo */}
        <div className="shrink-0 pl-1">
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="inline-flex items-center"
            aria-label="Resume Craft Home"
          >
            <BrandWordmark id="hero-header-brand" size="md" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="max-lg:hidden">
          <NavigationMenu className="bg-muted/90 p-1 rounded-full border border-border/40">
            <NavigationMenuList className="flex gap-0.5 space-x-0">
              {navigationData.map((navItem) => {
                const sectionId = navItem.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <NavigationMenuItem key={navItem.title}>
                    <NavigationMenuLink
                      id={`nav-link-${sectionId}`}
                      href={navItem.href}
                      onClick={(e) => handleLinkClick(e, navItem.href)}
                      className={cn(
                        "inline-block px-3 xl:px-4 py-1.5 text-[13px] xl:text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-sm transition tracking-normal whitespace-nowrap",
                        isActive
                          ? "bg-background text-foreground shadow-sm"
                          : ""
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {navItem.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop & Mobile Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Switcher */}
          <div className="flex items-center shrink-0">
            <CinematicThemeSwitcher size="navbar" />
          </div>

          {/* Desktop Auth & Primary Pill CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                <ProfileDropdown
                  onNavigateToProfile={onNavigateToProfile}
                  onNavigateToDashboard={
                    onNavigateToDashboard ||
                    (() =>
                      document
                        .getElementById("home")
                        ?.scrollIntoView({ behavior: "smooth" }))
                  }
                  onNavigateToEditor={onStartBuilding}
                />
                {onStartBuilding && (
                  <HeaderActionPill
                    id="desktop-nav-create-btn"
                    label="Create Resume"
                    onClick={() => onStartBuilding()}
                  />
                )}
              </>
            ) : (
              <>
                {onStartBuilding && (
                  <HeaderActionPill
                    id="desktop-nav-create-btn"
                    label="Create Resume"
                    onClick={() => onStartBuilding()}
                  />
                )}
              </>
            )}
          </div>

          {/* Mobile / Tablet Sheet Trigger */}
          <div className="lg:hidden flex items-center shrink-0">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  id="mobile-menu-trigger"
                  type="button"
                  aria-label="Open menu"
                  className="rounded-full border border-border p-2 block bg-background/80 hover:bg-muted transition-colors cursor-pointer"
                >
                  <Menu width={18} height={18} aria-hidden="true" />
                </button>
              </SheetTrigger>

              <SheetContent
                showCloseButton={false}
                side="right"
                className="w-full sm:w-96 p-0 border-l-0 flex flex-col"
              >
                <div className="flex items-center justify-between p-6">
                  <a
                    href="#home"
                    onClick={(e) => handleLinkClick(e, "#home")}
                    aria-label="Resume Craft Home"
                  >
                    <BrandWordmark size="lg" />
                  </a>
                  <SheetClose asChild>
                    <button
                      id="mobile-menu-close"
                      type="button"
                      aria-label="Close menu"
                      className="rounded-full border border-border p-2.5 block hover:bg-muted transition-colors cursor-pointer"
                    >
                      <X width={16} height={16} aria-hidden="true" />
                    </button>
                  </SheetClose>
                </div>

                <div className="flex-1 flex flex-col gap-8 px-6 pb-6 overflow-y-auto">
                  <div className="flex flex-col gap-6">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                    <NavigationMenu
                      orientation="vertical"
                      className="items-start flex-none max-w-full justify-start"
                    >
                      <NavigationMenuList className="flex flex-col items-start gap-3 space-x-0">
                        {navigationData.map((item) => {
                          const sectionId = item.href.replace("#", "");
                          const isActive = activeSection === sectionId;
                          return (
                            <NavigationMenuItem key={item.title}>
                              <NavigationMenuLink
                                id={`mobile-nav-link-${sectionId}`}
                                href={item.href}
                                onClick={(e) => handleLinkClick(e, item.href)}
                                className={cn(
                                  "group/nav flex items-center text-2xl font-semibold tracking-tight transition-all p-0 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:translate-x-2"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-0.5 bg-primary transition-all duration-300 overflow-hidden",
                                    isActive
                                      ? "w-4 mr-2 opacity-100"
                                      : "w-0 opacity-0 group-hover/nav:w-4 group-hover/nav:mr-2 group-hover/nav:opacity-100"
                                  )}
                                />
                                {item.title}
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          );
                        })}
                      </NavigationMenuList>
                    </NavigationMenu>

                    {/* Mobile Auth / CTA Controls */}
                    {isAuthenticated && user ? (
                      <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                        <div className="py-2 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-primary text-primary-foreground shrink-0">
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
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {onStartBuilding && (
                          <HeaderActionPill
                            id="mobile-nav-create-btn"
                            label="Create Resume"
                            onClick={() => {
                              setIsOpen(false);
                              onStartBuilding();
                            }}
                          />
                        )}

                        {onNavigateToDashboard && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onNavigateToDashboard();
                            }}
                            className="flex items-center gap-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                          >
                            <FileText className="w-4 h-4" />
                            <span>My Resumes</span>
                          </button>
                        )}

                        {onNavigateToProfile && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onNavigateToProfile();
                            }}
                            className="flex items-center gap-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 pt-2">
                        {onStartBuilding && (
                          <HeaderActionPill
                            id="mobile-nav-create-btn"
                            label="Create Resume"
                            onClick={() => {
                              setIsOpen(false);
                              onStartBuilding();
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile Sheet Footer */}
                  <div className="mt-auto flex flex-col gap-4 pt-4">
                    <div className="flex gap-3">
                      <a
                        href="https://github.com/SurajRawatr07"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile of Suraj Rawat"
                        className="flex items-center justify-center rounded-full outline outline-1 outline-border hover:bg-muted transition p-3 shadow-sm"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/suraj-rawat-30513b340"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile of Suraj Rawat"
                        className="flex items-center justify-center rounded-full outline outline-1 outline-border hover:bg-muted transition p-3 shadow-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      © {currentYear} Resume Craft
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
