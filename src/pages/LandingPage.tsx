import React, { useState } from 'react';

import {
  AnimatedChooseTemplateIcon,
  AnimatedAddInfoIcon,
  AnimatedCustomizeResumeIcon,
  AnimatedExportIcon,
  AnimatedTemplatesGridIcon,
  AnimatedATSScanIcon,
  AnimatedLiveEditIcon,
  AnimatedPdfExportIcon,
  AnimatedTemplateSwitchIcon,
  AnimatedResponsiveDevicesIcon,
} from '@/components/icons/animated';

import { useTheme } from '@/context/ThemeContext';
import HeroOne from '@/components/ui/hero-01';
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
  onNavigateToDashboard?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
}

const steps = [
  {
    step: '01',
    icon: AnimatedChooseTemplateIcon,
    title: 'Choose a Template',
    desc: 'Select a professional resume format designed for your career path.',
  },
  {
    step: '02',
    icon: AnimatedAddInfoIcon,
    title: 'Add Your Information',
    desc: 'Enter your education, experience, skills, projects and other relevant information.',
  },
  {
    step: '03',
    icon: AnimatedCustomizeResumeIcon,
    title: 'Customize Your Resume',
    desc: 'Edit sections and adjust your content while keeping the professional document structure.',
  },
  {
    step: '04',
    icon: AnimatedExportIcon,
    title: 'Export',
    desc: 'Generate your final resume as a clean, print-ready PDF.',
  },
];

const features = [
  {
    icon: AnimatedTemplatesGridIcon,
    title: 'Professional Templates',
    desc: 'Real resume structures designed for different career paths.',
  },
  {
    icon: AnimatedATSScanIcon,
    title: 'ATS-Friendly Structure',
    desc: 'Clean semantic formatting designed to remain readable by applicant tracking systems.',
  },
  {
    icon: AnimatedLiveEditIcon,
    title: 'Live Resume Editing',
    desc: 'Update resume information and see changes immediately.',
  },
  {
    icon: AnimatedPdfExportIcon,
    title: 'PDF Export',
    desc: 'Generate a clean printable PDF.',
  },
  {
    icon: AnimatedTemplateSwitchIcon,
    title: 'Template Switching',
    desc: 'Change resume templates without losing your entered information.',
  },
  {
    icon: AnimatedResponsiveDevicesIcon,
    title: 'Responsive Experience',
    desc: 'Create and manage resumes across desktop, tablet and mobile.',
  },
];

const faqs = [
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

const renderBrandCopy = (text: string): React.ReactNode => {
  if (!text.includes('Resume Craft')) return text;
  const parts = text.split('Resume Craft');
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="brand-script-text text-[1.15em] font-normal text-neutral-900 dark:text-neutral-100">
              Resume Craft
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

interface StepCardProps {
  step: (typeof steps)[number];
  isDark: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = step.icon;

  return (
    <GlowingShadow variant="subtle" rounded="rounded-2xl" className="h-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-full p-6 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#171717] border-white/[0.09] hover:border-white/[0.16]'
            : 'bg-white border-black/[0.08] shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 text-[#111111] dark:text-neutral-100 flex items-center justify-center transition-colors">
            <Icon
              isHovered={isHovered}
              className="w-7 h-7 sm:w-7 sm:h-7 md:w-[30px] md:h-[30px] lg:w-8 lg:h-8 text-[#111111] dark:text-neutral-100"
            />
          </div>
          <span className="text-2xl font-black text-gray-300 dark:text-gray-700 select-none">
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
};

interface FeatureCardProps {
  feature: (typeof features)[number];
  isDark: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <GlowingShadow variant="subtle" rounded="rounded-2xl" className="h-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-full p-6 sm:p-7 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#171717] border-white/[0.09] hover:border-white/[0.16]'
            : 'bg-white border-black/[0.08] shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors bg-neutral-100 dark:bg-neutral-800/80 text-[#111111] dark:text-neutral-100">
          <Icon
            isHovered={isHovered}
            className="w-7 h-7 sm:w-7 sm:h-7 md:w-[30px] md:h-[30px] lg:w-8 lg:h-8 text-[#111111] dark:text-neutral-100"
          />
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
};

export default function LandingPage({
  onStartBuilding,
  onNavigateToDashboard,
  onNavigateToProfile,
  onNavigateToLogin,
}: LandingPageProps) {
  const { isDark } = useTheme();

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-200 bg-transparent ${
        isDark ? 'text-[#F3F3EE]' : 'text-gray-900'
      }`}
    >
      {/* ========================================
          1. HERO-01 TEMPLATE (Header + Hero + BrandSlider)
      ======================================== */}
      <HeroOne
        onStartBuilding={onStartBuilding}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToProfile={onNavigateToProfile}
        onScrollTo={scrollTo}
      />

      {/* ========================================
          2. HOW IT WORKS
      ======================================== */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 border-b border-black/[0.06] dark:border-white/[0.08] bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              How It Works
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create a recruiter-ready, ATS-compliant resume in minutes without design friction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <StepCard key={step.step} step={step} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          3. TEMPLATES
      ======================================== */}
      <section
        id="templates"
        className="py-20 sm:py-24 border-b border-black/[0.06] dark:border-white/[0.08] bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Role-Specific Designs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              9 Professional Resume Templates
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Engineered with single-column layouts, strict semantic hierarchy, and verified ATS compatibility. Filter by role and preview in full A4 resolution.
            </p>
          </div>

          <TemplateGallery onSelectTemplate={() => onStartBuilding()} />
        </div>
      </section>

      {/* ========================================
          4. FEATURES
      ======================================== */}
      <section
        id="features"
        className="py-20 sm:py-24 border-b border-black/[0.06] dark:border-white/[0.08] bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Built For Precision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Engineered for Job Seekers &amp; Recruiters
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Every tool and structure you need to deliver an error-free, high-conversion resume.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          5. FAQ
      ======================================== */}
      <section id="faq" className="py-20 sm:py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Questions &amp; Answers
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {renderBrandCopy(
                'Clear answers to common questions about Resume Craft and our ATS templates.'
              )}
            </p>
          </div>

          <DisclosureGroup defaultExpandedKeys={['faq-1']} allowsMultipleExpanded={false}>
            {faqs.map((faq) => (
              <Disclosure key={faq.id} id={faq.id}>
                <DisclosureTrigger>
                  <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 pr-4 leading-snug">
                    {renderBrandCopy(faq.question)}
                  </span>
                  <DisclosureIndicator />
                </DisclosureTrigger>
                <DisclosurePanel>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {renderBrandCopy(faq.answer)}
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
