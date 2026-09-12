import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  Zap,
  Download,
  Eye,
  Layout,
  Menu,
  X,
  ArrowRight,
  Shield,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  MousePointerClick,
  Sparkles,
  Smartphone,
  LogIn,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import TemplateGallery from '@/components/features/TemplateGallery';
import StackedCircularFooter from '@/components/ui/StackedCircularFooter';
import { TemplateType } from '@/types/resume';

interface LandingPageProps {
  onStartBuilding: (templateId?: TemplateType) => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
}

/* ========================================
   NAVIGATION (Strict requested order)
   Home → How It Works → Templates → Features
======================================== */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Templates', href: '#templates' },
  { label: 'Features', href: '#features' },
];

/* ========================================
   HOW IT WORKS (4-Step Process)
======================================== */
const steps = [
  {
    step: '01',
    icon: Layout,
    title: 'Choose a Template',
    desc: 'Select a professional resume format designed for your career path.',
  },
  {
    step: '02',
    icon: MousePointerClick,
    title: 'Add Your Information',
    desc: 'Enter your education, experience, skills, projects and other relevant information.',
  },
  {
    step: '03',
    icon: Eye,
    title: 'Customize Your Resume',
    desc: 'Edit sections and adjust your content while keeping the professional document structure.',
  },
  {
    step: '04',
    icon: Download,
    title: 'Export',
    desc: 'Generate your final resume as a clean, print-ready PDF.',
  },
];

/* ========================================
   FEATURES (6 Core Features)
======================================== */
const features = [
  {
    icon: Layout,
    title: 'Professional Templates',
    desc: 'Real resume structures designed for different career paths.',
    accent: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
  },
  {
    icon: Zap,
    title: 'ATS-Friendly Structure',
    desc: 'Clean semantic formatting designed to remain readable by applicant tracking systems.',
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    icon: Eye,
    title: 'Live Resume Editing',
    desc: 'Update resume information and see changes immediately.',
    accent: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    icon: Download,
    title: 'PDF Export',
    desc: 'Generate a clean printable PDF.',
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    icon: RefreshCw,
    title: 'Template Switching',
    desc: 'Change resume templates without losing your entered information.',
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    icon: Smartphone,
    title: 'Responsive Experience',
    desc: 'Create and manage resumes across desktop, tablet and mobile.',
    accent: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
  },
];

/* ========================================
   FAQ (4 Requested Questions & Answers)
======================================== */
const faqItems = [
  {
    question: 'Is Resume Craft free to use?',
    answer:
      'Yes. Resume Craft is free to use with full access to all 9 professional templates, live editing, and high-quality PDF exports without subscriptions or fees.',
  },
  {
    question: 'Are the resume templates ATS-friendly?',
    answer:
      'Yes. The templates use clean, single-column semantic structures and standard section headings designed to remain readable by applicant tracking systems, without confusing visual graphics.',
  },
  {
    question: 'Can I change my resume template after entering my information?',
    answer:
      'Yes. You can switch between any of the 9 supported templates at any time in the editor. Your entered information is preserved across layouts without having to re-enter anything.',
  },
  {
    question: 'Can I download my resume as a PDF?',
    answer:
      'Yes. You can export and download your resume as a clean, print-ready A4 PDF directly from the editor toolbar whenever you are ready.',
  },
];

/* ========================================
   REALISTIC OVERLEAF MOCK RESUME
======================================== */
const RealisticOverleafResume = ({ isDark }: { isDark: boolean }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-[340px] sm:max-w-[390px] rounded-lg border shadow-xl p-5 sm:p-6 select-none ${
        isDark
          ? 'bg-white text-gray-900 border-gray-700'
          : 'bg-white text-gray-900 border-gray-200'
      }`}
      style={{
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* Header */}
      <div className="text-center pb-2.5 border-b border-gray-900 mb-3">
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-950">
          YOUR NAME
        </h3>
        <p className="text-[11px] text-gray-600 mt-0.5 tracking-wide">
          Software Engineer
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          email@example.com • linkedin.com/in/profile • github.com/profile
        </p>
      </div>

      {/* Education */}
      <div className="mb-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950">
            Education
          </span>
          <span className="text-[9px] text-gray-500">Overleaf LaTeX</span>
        </div>
        <div className="flex justify-between items-baseline text-[11px] font-semibold text-gray-900">
          <span>University Institute of Technology</span>
          <span className="text-[10px] text-gray-600 font-normal">2019 – 2023</span>
        </div>
        <p className="text-[10px] text-gray-700 italic">
          B.S. in Computer Science & Engineering
        </p>
      </div>

      {/* Experience */}
      <div className="mb-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950">
            Experience
          </span>
          <span className="text-[9px] text-gray-500">Single-Column ATS</span>
        </div>
        <div className="flex justify-between items-baseline text-[11px] font-semibold text-gray-900">
          <span>Software Engineer • Tech Systems</span>
          <span className="text-[10px] text-gray-600 font-normal">2021 – Present</span>
        </div>
        <ul className="list-disc list-outside ml-3 text-[10px] text-gray-700 space-y-1 mt-1">
          <li>Architected distributed microservices and streamlined API response pipelines.</li>
          <li>Optimized relational database queries and data caching mechanisms.</li>
        </ul>
      </div>

      {/* Technical Skills */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950">
            Technical Skills
          </span>
          <span className="text-[9px] text-emerald-700 font-medium">ATS-Friendly</span>
        </div>
        <div className="text-[10px] text-gray-800 leading-relaxed">
          <span className="font-semibold">Languages:</span> TypeScript, JavaScript, Python, SQL<br />
          <span className="font-semibold">Frameworks & Tools:</span> React, Node.js, Docker, Git, PostgreSQL
        </div>
      </div>
    </motion.div>
  );
};

/* ========================================
   MAIN COMPONENT
======================================== */
export default function LandingPage({
  onStartBuilding,
  onNavigateToProfile,
  onNavigateToLogin,
}: LandingPageProps) {
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({
      behavior: 'smooth',
    });
    setMobileMenuOpen(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      id="home"
      className={`min-h-screen overflow-x-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* ========================================
          NAVBAR
      ======================================== */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-gray-900/90 border-b border-gray-800 shadow-lg'
              : 'bg-white/95 border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          {/* Brand Wordmark */}
          <div
            onClick={() => scrollTo('#home')}
            className="cursor-pointer select-none group flex items-center min-w-0"
          >
            <span className="brand-wordmark text-xl sm:text-2xl font-bold tracking-[0.075em] text-gray-900 dark:text-white select-none whitespace-nowrap">
              Resume Craft
            </span>
          </div>

          {/* Desktop Nav - Exact Order: Home → How It Works → Templates → Features → FAQ */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Blind Pull Theme Toggle */}
            <ThemeToggle />

            {/* Authentication / Profile controls according to current login state */}
            {isAuthenticated ? (
              <ProfileDropdown
                onNavigateToProfile={onNavigateToProfile}
                onNavigateToDashboard={() => scrollTo('#home')}
                onNavigateToEditor={() => onStartBuilding()}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToLogin || (() => onStartBuilding())}
                  className={`rounded-xl text-sm font-medium ${
                    isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span>Sign In</span>
                </Button>

                <Button
                  onClick={() => onStartBuilding()}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm h-10 px-4 shadow-sm"
                >
                  Create Resume
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500/10"
                  >
                    {link.label}
                  </button>
                ))}

                {isAuthenticated && onNavigateToProfile && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateToProfile();
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                  >
                    My Account Profile
                  </button>
                )}

                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartBuilding();
                  }}
                  className="w-full mt-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Create Resume
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================
          1. HOME (HERO SECTION)
      ======================================== */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-gray-100 dark:border-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 mb-6">
              <span className="brand-wordmark text-xs font-bold tracking-[0.075em]">Resume Craft</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900 dark:text-white">
              Build a professional resume that gets noticed.
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Create clean, ATS-friendly resumes using professionally structured templates for different career paths.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5">
              <Button
                onClick={() => onStartBuilding()}
                className="h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm flex items-center gap-2"
              >
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => scrollTo('#templates')}
                className={`h-12 px-6 rounded-xl font-medium ${
                  isDark
                    ? 'border-gray-800 hover:bg-gray-800 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Explore Templates
              </Button>
            </div>
          </div>

          {/* Right Column: Realistic Overleaf Document Mock */}
          <div className="flex-1 flex justify-center w-full">
            <div className="relative">
              <RealisticOverleafResume isDark={isDark} />

              {/* Verified Tag */}
              <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Overleaf LaTeX Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          2. HOW IT WORKS
      ======================================== */}
      <section
        id="how-it-works"
        className={`py-20 sm:py-24 border-b ${
          isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50/70 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              How It Works
            </h2>
            <p
              className={`text-sm sm:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Create a recruiter-ready, ATS-compliant resume in minutes without design friction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-gray-300 dark:text-gray-700">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-2 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          3. TEMPLATES
      ======================================== */}
      <section id="templates" className="py-20 sm:py-24 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Role-Specific Designs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              9 Professional Resume Templates
            </h2>
            <p
              className={`text-sm sm:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Engineered with single-column layouts, strict semantic hierarchy, and verified ATS compatibility. Filter by role and preview in full A4 resolution.
            </p>
          </div>

          {/* Template Gallery with Filtering */}
          <TemplateGallery
            onSelectTemplate={() => onStartBuilding()}
          />
        </div>
      </section>

      {/* ========================================
          4. FEATURES
      ======================================== */}
      <section
        id="features"
        className={`py-20 sm:py-24 border-b ${
          isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50/70 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Built For Precision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Engineered for Job Seekers & Recruiters
            </h2>
            <p
              className={`text-sm sm:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Every tool and structure you need to deliver an error-free, high-conversion resume.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          5. FAQ
      ======================================== */}
      <section id="faq" className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Questions & Answers
            </h2>
            <p
              className={`text-sm sm:text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Clear answers to common questions about Resume Craft and our ATS templates.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className={`rounded-2xl border transition-colors ${
                    isDark
                      ? 'bg-gray-900/70 border-gray-800'
                      : 'bg-white border-gray-200 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm leading-relaxed border-t pt-4 ${
                            isDark
                              ? 'text-gray-400 border-gray-800'
                              : 'text-gray-600 border-gray-100'
                          }`}
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          6. FOOTER
      ======================================== */}
      <StackedCircularFooter
        isDark={isDark}
        scrollTo={scrollTo}
        onStartBuilding={() => onStartBuilding()}
      />
    </div>
  );
}
