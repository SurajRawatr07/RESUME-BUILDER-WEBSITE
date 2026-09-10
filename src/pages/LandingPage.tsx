import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';

import {
  FileText,
  Zap,
  Download,
  Eye,
  FileCheck,
  Layout,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Shield,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Share2,
  MousePointerClick,
  BadgeCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import TemplateGallery from '@/components/features/TemplateGallery';

interface LandingPageProps {
  onStartBuilding: () => void;
  onNavigateToProfile?: () => void;
}

/* ========================================
   NAVIGATION
======================================== */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Templates', href: '#templates' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

/* ========================================
   FEATURES
======================================== */
const features = [
  {
    icon: Zap,
    title: 'ATS Optimized',
    desc: 'Professional ATS-friendly resume templates.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    desc: 'See changes instantly while editing.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    icon: Download,
    title: 'PDF Export',
    desc: 'Export high-quality resumes in one click.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    icon: FileCheck,
    title: 'ATS Checker',
    desc: 'Improve resume keyword matching score.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    icon: Layout,
    title: 'Premium Templates',
    desc: 'Modern layouts for every profession.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
  },
  {
    icon: Shield,
    title: 'Privacy Secure',
    desc: 'Your resume data stays safe & protected.',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
  },
];

/* ========================================
   HOW IT WORKS
======================================== */
const steps = [
  {
    icon: Layout,
    title: 'Choose Template',
    desc: 'Pick a modern ATS-friendly design.',
  },
  {
    icon: MousePointerClick,
    title: 'Fill Your Details',
    desc: 'Add skills, projects and experience.',
  },
  {
    icon: BadgeCheck,
    title: 'Optimize Resume',
    desc: 'Improve ATS score with smart tips.',
  },
  {
    icon: Download,
    title: 'Download & Share',
    desc: 'Export PDF and share instantly.',
  },
];

/* ========================================
   STATS
======================================== */
const stats = [
  { value: '8', label: 'Templates' },
  { value: '100%', label: 'ATS Friendly' },
  { value: '24/7', label: 'Access' },
  { value: 'Free', label: 'To Start' },
];

/* ========================================
   TOAST TYPES
======================================== */
interface Toast {
  id: number;
  message: string;
}

/* ========================================
   MOCK RESUME
======================================== */
const MockResume = ({
  isDark,
}: {
  isDark: boolean;
}) => {
  return (
    <motion.div
      whileHover={{
        rotate: -1,
        scale: 1.02,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
      }}
      className={`w-[280px] sm:w-[330px] rounded-[34px] overflow-hidden border shadow-2xl ${
        isDark
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
        <div className="h-3 w-3/4 bg-white rounded-full mb-3" />
        <div className="h-2 w-1/2 bg-white/60 rounded-full" />
      </div>

      <div className="flex">
        <div className="w-[35%] bg-indigo-600 p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                delay: i * 0.1,
              }}
              className="h-2 bg-white/40 rounded-full"
            />
          ))}
        </div>

        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: i * 0.08,
              }}
              className={`rounded-full ${
                i % 2 === 0
                  ? 'h-2 bg-gray-200'
                  : 'h-3 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ========================================
   TOAST COMPONENT
======================================== */
const ToastSystem = ({
  toasts,
}: {
  toasts: Toast[];
}) => {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 50,
            }}
            className="bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />

            <span className="text-sm font-medium">
              {toast.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ========================================
   MAIN COMPONENT
======================================== */
export default function LandingPage({
  onStartBuilding,
  onNavigateToProfile,
}: LandingPageProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>(
    []
  );

  /* ========================================
     PARALLAX
  ======================================== */
  const { scrollY } = useScroll();

  const heroY = useTransform(
    scrollY,
    [0, 500],
    [0, 120]
  );

  /* ========================================
     TOAST
  ======================================== */
  const showToast = (message: string) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3000);
  };

  /* ========================================
     EFFECTS
  ======================================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  /* ========================================
     SCROLL
  ======================================== */
  const scrollTo = (id: string) => {
    document
      .getElementById(id.replace('#', ''))
      ?.scrollIntoView({
        behavior: 'smooth',
      });

    setMobileMenuOpen(false);
  };

  /* ========================================
     DOWNLOAD
  ======================================== */
  const simulateDownload = () => {
    showToast('Resume Downloaded!');
  };

  /* ========================================
     SHARE
  ======================================== */
  const simulateShare = () => {
    showToast('Share link copied!');
  };

  return (
    <div
      id="home"
      style={{
        fontFamily: '"Times New Roman", serif',
      }}
      className={`min-h-screen overflow-x-hidden transition-all duration-300 ${
        isDark
          ? 'bg-gray-950 text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* TOASTS */}
      <ToastSystem toasts={toasts} />

      {/* ========================================
          NAVBAR
      ======================================== */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-gray-900/90 border-b border-gray-800'
              : 'bg-white/90 border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-[74px] flex items-center justify-between">
          {/* LOGO */}
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SmartResume
            </h1>
          </motion.div>

          {/* NAV */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <ProfileDropdown
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToDashboard={() => scrollTo('#home')}
              onNavigateToEditor={onStartBuilding}
            />

            <Button
              onClick={onStartBuilding}
              className="hidden sm:flex rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-semibold"
            >
              Build Resume
            </Button>

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="lg:hidden p-1.5 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className={`lg:hidden border-t ${
                isDark
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() =>
                      scrollTo(link.href)
                    }
                    className="block w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-500/10"
                  >
                    {link.label}
                  </button>
                ))}

                {onNavigateToProfile && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateToProfile();
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl font-semibold hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  >
                    My Account Profile
                  </button>
                )}

                <Button
                  onClick={onStartBuilding}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                >
                  Start Building
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* BG */}
        <motion.div
          style={{
            y: heroY,
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full" />

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          {/* LEFT */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Welcome {user?.name || 'User'}
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              Build Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dream Resume
              </span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className={`text-lg leading-relaxed mb-8 max-w-2xl ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Create modern ATS-friendly resumes
              with premium templates, live preview
              and one-click PDF export.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <Button
                onClick={onStartBuilding}
                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
              >
                Start Building
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className={`p-5 rounded-3xl border backdrop-blur-sm ${
                    isDark
                      ? 'bg-gray-900/70 border-gray-800'
                      : 'bg-white/80 border-gray-200 shadow-sm'
                  }`}
                >
                  <h3 className="text-2xl font-extrabold text-indigo-600">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex justify-center">
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="relative"
            >
              <MockResume isDark={isDark} />

              {/* BADGES */}
              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                className="absolute -top-5 -right-4 bg-white px-4 py-2 rounded-2xl shadow-xl border text-sm font-semibold text-gray-800"
              >
                ⭐ ATS Score 98%
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                className="absolute -bottom-5 -left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-xl text-sm font-semibold"
              >
                PDF Export
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS
      ======================================== */}
      <section
        id="how-it-works"
        className={`py-24 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">
              How It Works
            </h2>

            <p
              className={`max-w-2xl mx-auto ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Create your professional resume in
              minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`relative p-7 rounded-[30px] border ${
                  isDark
                    ? 'bg-gray-950 border-gray-800'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="absolute top-5 right-5 text-5xl font-black opacity-10">
                  0{index + 1}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-5 text-white">
                  <step.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>

                <p
                  className={
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          TEMPLATES
      ======================================== */}
      <section
        id="templates"
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Resume Templates
            </h2>

            <p
              className={`max-w-2xl mx-auto ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Choose from beautiful professional
              resume templates.
            </p>
          </div>

          <TemplateGallery
            onSelectTemplate={
              onStartBuilding
            }
          />
        </div>
      </section>

      {/* ========================================
          FEATURES
      ======================================== */}
      <section
        id="features"
        className={`py-24 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Powerful Features
            </h2>

            <p
              className={`max-w-2xl mx-auto ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              Everything you need to create a winning
              resume.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className={`p-7 rounded-[28px] border transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-950 border-gray-800 hover:border-indigo-500'
                    : 'bg-white border-gray-200 shadow-sm hover:shadow-xl'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: feature.bg,
                  }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{
                      color: feature.color,
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>

                <p
                  className={
                    isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer
        className={`relative overflow-hidden border-t ${
          isDark
            ? 'bg-gray-950 border-gray-800'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold">
                    SmartResume
                  </h2>

                  <p className="text-xs text-indigo-500 font-semibold">
                    Resume Builder Platform
                  </p>
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed ${
                  isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Create modern ATS-friendly resumes
                and boost your hiring chances with
                beautiful templates.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="font-bold text-lg mb-5">
                Quick Links
              </h3>

              <div className="space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() =>
                      scrollTo(link.href)
                    }
                    className={`block transition hover:translate-x-1 ${
                      isDark
                        ? 'text-gray-400 hover:text-indigo-400'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="font-bold text-lg mb-5">
                Contact Info
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-500" />

                  <span>
                    rawatsuraj80627@gmail.com
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-indigo-500" />

                  <span>+91 9675219087</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-indigo-500" />

                  <span>India</span>
                </div>
              </div>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="font-bold text-lg mb-5">
                Follow Us
              </h3>

              <div className="flex gap-4">
                <motion.a
                  whileHover={{
                    scale: 1.1,
                  }}
                  href="https://github.com/SurajRawatr07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-900 border border-gray-800 hover:border-indigo-500'
                      : 'bg-gray-100 border border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  <Github className="w-5 h-5" />
                </motion.a>

                <motion.a
                  whileHover={{
                    scale: 1.1,
                  }}
                  href="https://www.linkedin.com/in/suraj-rawat-30513b340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div
            className={`mt-14 pt-7 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm ${
              isDark
                ? 'border-gray-800 text-gray-500'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            <p className="text-center md:text-left">
              © 2026 SmartResume. Made by Suraj
              Rawat.
            </p>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              <button className="hover:text-indigo-500 transition">
                Privacy Policy
              </button>

              <button className="hover:text-indigo-500 transition">
                Terms & Conditions
              </button>

              <button className="hover:text-indigo-500 transition">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
