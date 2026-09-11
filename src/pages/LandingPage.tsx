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
  { label: 'FAQ', href: '#faq' },
];

/* ========================================
   HOW IT WORKS (4-Step Process)
======================================== */
const steps = [
  {
    step: '01',
    icon: Layout,
    title: 'Choose a Template',
    desc: 'Select from 9 role-oriented professional resume templates inspired by Overleaf and LaTeX designs.',
  },
  {
    step: '02',
    icon: MousePointerClick,
    title: 'Enter Your Details',
    desc: 'Fill in your experience, education, skills, projects, and achievements in our clean, focused editor.',
  },
  {
    step: '03',
    icon: Eye,
    title: 'Preview & Customize',
    desc: 'See your changes in real-time with instant ATS-friendly formatting, typography adjustments, and structural layout.',
  },
  {
    step: '04',
    icon: Download,
    title: 'Export as PDF',
    desc: 'Download your print-ready, high-resolution resume formatted specifically for job applications and recruiter systems.',
  },
];

/* ========================================
   FEATURES (6 Requested Core Features)
======================================== */
const features = [
  {
    icon: Layout,
    title: 'Professional Templates',
    desc: '9 role-oriented designs modeled after established Overleaf and LaTeX resumes for software, tech, engineering, and general roles.',
    accent: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
  },
  {
    icon: Zap,
    title: 'ATS-Friendly Structure',
    desc: 'Machine-readable single-column layouts engineered to pass recruiter screening software without parsing errors.',
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    icon: Eye,
    title: 'Live Real-Time Preview',
    desc: 'Instant dynamic preview as you type your experience, projects, and technical skills with zero delay.',
    accent: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    icon: Download,
    title: 'Print-Ready PDF Export',
    desc: 'High-resolution A4 PDF downloads with exact typesetting, sharp borders, and standard print margins.',
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    icon: RefreshCw,
    title: 'Seamless Template Switching',
    desc: 'Change layouts instantly without re-typing or losing any of your saved resume data across all 9 styles.',
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    icon: Smartphone,
    title: 'Responsive & Accessible',
    desc: 'Fully optimized across desktop, tablet, and mobile devices with complete light and dark theme support.',
    accent: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
  },
];

/* ========================================
   FAQ (4 Requested Questions & Answers)
======================================== */
const faqItems = [
  {
    question: 'Is Resume Craft completely free to use?',
    answer:
      'Yes, Resume Craft is 100% free with unrestricted access to all 9 professional resume templates, live editing, and high-quality PDF downloads without hidden paywalls or subscription requirements.',
  },
  {
    question: 'Are these templates ATS-friendly?',
    answer:
      'Yes. Every template is engineered strictly following modern Applicant Tracking System (ATS) guidelines—clean single-column layouts, standard semantic typography, machine-readable text structures, and zero unreadable graphic elements.',
  },
  {
    question: 'Can I switch templates without losing my data?',
    answer:
      'Yes! All your resume content, work history, projects, and skills are preserved across templates so you can switch and compare layouts seamlessly at any time without re-entering information.',
  },
  {
    question: 'How do I download my resume as a PDF?',
    answer:
      "Click the 'Export PDF' or 'Download PDF' button in the editor toolbar. Your resume will be formatted to exact A4 print specifications ready for employer and recruiter submission.",
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
        fontFamily: 'serif',
      }}
    >
      {/* Header */}
      <div className="text-center pb-2.5 border-b border-gray-900 mb-3">
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-950">
          SURAJ RAWAT
        </h3>
        <p className="text-[11px] text-gray-600 font-sans mt-0.5">
          Software Engineer • Haldwani, India
        </p>
        <p className="text-[10px] text-gray-500 font-sans mt-0.5">
          rawatsuraj80627@gmail.com • github.com/SurajRawatr07 • linkedin.com/in/suraj-rawat
        </p>
      </div>

      {/* Education */}
      <div className="mb-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950 font-sans">
            Education
          </span>
          <span className="text-[9px] text-gray-500 font-sans">Overleaf LaTeX</span>
        </div>
        <div className="flex justify-between items-baseline text-[11px] font-semibold text-gray-900">
          <span>Uttarakhand Technical University</span>
          <span className="text-[10px] text-gray-600 font-normal">2019 – 2023</span>
        </div>
        <p className="text-[10px] text-gray-700 italic">
          B.Tech in Computer Science & Engineering (8.6 GPA)
        </p>
      </div>

      {/* Experience */}
      <div className="mb-3">
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950 font-sans">
            Experience
          </span>
          <span className="text-[9px] text-gray-500 font-sans">Single-Column ATS</span>
        </div>
        <div className="flex justify-between items-baseline text-[11px] font-semibold text-gray-900">
          <span>Software Engineer • Tech Solutions</span>
          <span className="text-[10px] text-gray-600 font-normal">2021 – Present</span>
        </div>
        <ul className="list-disc list-outside ml-3 text-[10px] text-gray-700 space-y-1 mt-1 font-sans">
          <li>Architected distributed microservices handling 2.5M+ requests daily.</li>
          <li>Optimized PostgreSQL queries & Redis caching, slashing p99 latency by 42%.</li>
        </ul>
      </div>

      {/* Technical Skills */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-0.5 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-950 font-sans">
            Technical Skills
          </span>
          <span className="text-[9px] text-emerald-700 font-sans font-medium">ATS Verified</span>
        </div>
        <div className="text-[10px] text-gray-800 font-sans leading-relaxed">
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
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
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
              <>
                <ProfileDropdown
                  onNavigateToProfile={onNavigateToProfile}
                  onNavigateToDashboard={() => scrollTo('#home')}
                  onNavigateToEditor={() => onStartBuilding()}
                />
                <Button
                  onClick={() => onStartBuilding()}
                  className="hidden sm:flex rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm h-10 px-4 shadow-sm"
                >
                  Create Resume
                </Button>
              </>
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Overleaf & LaTeX Professional Standards</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Professional Resumes.{' '}
              <span className="text-indigo-600 dark:text-indigo-400">
                Built for Real Jobs.
              </span>
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Craft ATS-optimized, single-column resumes inspired by proven Overleaf LaTeX conventions. Free to use, instant live preview, and one-click print-ready PDF export.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5">
              <Button
                onClick={() => onStartBuilding()}
                className="h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md flex items-center gap-2"
              >
                <span>Start Building</span>
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
                Browse 9 Templates
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100 dark:border-gray-800/70 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">9</p>
                <p className="text-xs text-gray-500 mt-0.5">Role Templates</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">100%</p>
                <p className="text-xs text-gray-500 mt-0.5">ATS-Readable</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">A4</p>
                <p className="text-xs text-gray-500 mt-0.5">Print-Ready PDF</p>
              </div>
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

          {/* Quick Start Card */}
          <div
            className={`mt-12 p-6 sm:p-8 rounded-2xl border text-center ${
              isDark
                ? 'bg-indigo-950/30 border-indigo-900/50'
                : 'bg-indigo-50/60 border-indigo-100'
            }`}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to create your professional resume?
            </h3>
            <p
              className={`text-xs sm:text-sm max-w-md mx-auto mb-5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Choose any of our 9 role-tested templates and export your print-ready PDF in minutes.
            </p>
            <Button
              onClick={() => onStartBuilding()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 h-11 shadow-sm"
            >
              Build My Resume Now
            </Button>
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
