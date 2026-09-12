import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import {
  Zap,
  Download,
  Eye,
  Layout,
  ArrowRight,
  Shield,
  RefreshCw,
  HelpCircle,
  MousePointerClick,
  Sparkles,
  Smartphone,
  LogIn,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import FloatingNavbar from '@/components/ui/FloatingNavbar';
import TemplateGallery from '@/components/features/TemplateGallery';
import StackedCircularFooter from '@/components/ui/StackedCircularFooter';
import GlowingShadow from '@/components/ui/GlowingShadow';
import {
  DisclosureGroup,
  Disclosure,
  DisclosureTrigger,
  DisclosureIndicator,
  DisclosurePanel,
} from '@/components/ui/DisclosureGroup';
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
   FAQ (Exactly 4 Requested Questions & Answers)
======================================== */
const faqItems = [
  {
    id: 'faq-1',
    question: 'What is Resume Craft?',
    answer:
      'Resume Craft is a modern resume builder that helps you create professional, ATS-friendly resumes using structured templates, live previews, and resume optimization tools.',
  },
  {
    id: 'faq-2',
    question: 'Are the resume templates ATS-friendly?',
    answer:
      'Yes. Resume Craft templates are designed with clean structure, readable typography, consistent sections, and ATS-friendly formatting to make resume content easier for applicant tracking systems to parse.',
  },
  {
    id: 'faq-3',
    question: 'Can I check my resume ATS score?',
    answer:
      'Yes. The ATS checker analyzes your resume against relevant criteria such as keywords, skills, experience, projects, structure, and ATS formatting to provide a role-aware score.',
  },
  {
    id: 'faq-4',
    question: 'Can I create a resume for different job roles?',
    answer:
      'Yes. Resume Craft provides templates and role-focused resume options for areas such as Software Engineering, Full Stack Development, Frontend Development, CS/IT, internships, fresher roles, and other professional positions.',
  },
];

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
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div
      id="home"
      className={`min-h-screen overflow-x-hidden transition-all duration-300 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* ========================================
          FLOATING NAVBAR (21st.dev inspired)
      ======================================== */}
      <FloatingNavbar
        navLinks={navLinks}
        onStartBuilding={onStartBuilding}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToLogin={onNavigateToLogin}
        onScrollTo={scrollTo}
      />

      {/* ========================================
          1. HOME (HERO SECTION - CENTERED PREMIUM)
      ======================================== */}
      <section className="relative pt-28 sm:pt-36 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 overflow-hidden border-b border-gray-100 dark:border-gray-900">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Main Heading */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-heading-shimmer text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.12] sm:leading-[1.1] text-gray-900 dark:text-white max-w-4xl mx-auto mb-6 select-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Build a professional resume that gets noticed.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-10 text-gray-600 dark:text-gray-300 font-normal select-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Create clean, ATS-friendly resumes using professionally structured templates for different career paths.
          </motion.p>

          {/* Existing Hero Actions / Buttons */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
          >
            <GlowingShadow variant="button" rounded="rounded-xl">
              <Button
                id="hero-create-resume-btn"
                onClick={() => onStartBuilding()}
                className="h-12 sm:h-13 px-7 sm:px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm flex items-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
              >
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </GlowingShadow>

            <Button
              id="hero-explore-templates-btn"
              variant="outline"
              onClick={() => scrollTo('#templates')}
              className={`h-12 sm:h-13 px-6 sm:px-7 rounded-xl font-medium text-sm sm:text-base transition-all cursor-pointer ${
                isDark
                  ? 'border-gray-800 hover:bg-gray-800 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Explore Templates
            </Button>
          </motion.div>
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
                <GlowingShadow
                  key={step.step}
                  variant="subtle"
                  rounded="rounded-2xl"
                  className="h-full"
                >
                  <div
                    className={`h-full p-6 rounded-2xl border transition-all ${
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
                </GlowingShadow>
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
                <GlowingShadow
                  key={feature.title}
                  variant="subtle"
                  rounded="rounded-2xl"
                  className="h-full"
                >
                  <div
                    className={`h-full p-6 sm:p-7 rounded-2xl border transition-all ${
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
                </GlowingShadow>
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

          <DisclosureGroup defaultExpandedKeys={['faq-1']} allowsMultipleExpanded={false}>
            {faqItems.map((item) => (
              <Disclosure key={item.id} id={item.id}>
                <DisclosureTrigger>
                  <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 pr-4 leading-snug">
                    {item.question}
                  </span>
                  <DisclosureIndicator />
                </DisclosureTrigger>
                <DisclosurePanel>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </DisclosureGroup>
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
