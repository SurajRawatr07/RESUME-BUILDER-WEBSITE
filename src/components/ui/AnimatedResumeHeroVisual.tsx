import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

export interface AnimatedResumeHeroVisualProps {
  className?: string;
  onExploreTemplates?: () => void;
  onCreateResume?: () => void;
}

export const AnimatedResumeHeroVisual: React.FC<AnimatedResumeHeroVisualProps> = ({
  className = '',
  onExploreTemplates,
  onCreateResume,
}) => {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Floating animation variants with subtle independent timing
  const floatTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 7,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      };

  const secondaryFloatTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 5.5,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
        delay: 0.8,
      };

  return (
    <div
      className={`relative w-full max-w-[560px] mx-auto select-none flex items-center justify-center ${className}`}
      aria-label="Interactive animated resume on laptop workspace illustration"
    >
      {/* Soft Ambient Depth Glow behind the composition */}
      <div
        className={`absolute inset-0 rounded-3xl filter blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'bg-gradient-to-tr from-indigo-500/10 via-neutral-700/10 to-indigo-400/10 opacity-70'
            : 'bg-gradient-to-tr from-indigo-200/40 via-neutral-200/30 to-indigo-100/30 opacity-60'
        }`}
      />

      {/* Main floating container (subtle 3D perspective tilt & slow float) */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : {
                opacity: 1,
                y: [0, -8, 0],
                rotateX: [0, 1.5, 0],
                rotateY: [0, -1.5, 0],
              }
        }
        transition={{
          opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          y: floatTransition,
          rotateX: floatTransition,
          rotateY: floatTransition,
        }}
        className="relative w-full z-10 flex flex-col items-center"
        style={{ perspective: 1200 }}
      >
        {/* =========================================================================
            LAPTOP HARDWARE BASE WITH WORKSPACE SCREEN
           ========================================================================= */}
        <div className="relative w-full max-w-[480px] sm:max-w-[520px]">
          {/* Laptop Screen Bezel */}
          <div
            className={`relative rounded-t-2xl sm:rounded-t-[20px] p-2.5 sm:p-3 pb-3 sm:pb-4 border shadow-2xl transition-all duration-300 ${
              isDark
                ? 'bg-neutral-900 border-neutral-700/80 shadow-black/80'
                : 'bg-neutral-800 border-neutral-700 shadow-slate-900/15'
            }`}
          >
            {/* Camera / Mic notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 border border-neutral-700" />
              <span className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Laptop Display Inner Screen */}
            <div
              className={`relative mt-2 rounded-lg overflow-hidden border transition-colors ${
                isDark
                  ? 'bg-[#0f1117] border-neutral-800 text-neutral-200'
                  : 'bg-[#f8fafc] border-neutral-200 text-neutral-800'
              }`}
              style={{ minHeight: '280px' }}
            >
              {/* Screen Top Editor Bar */}
              <div
                className={`px-3 py-2 border-b flex items-center justify-between text-[11px] font-medium ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-800 text-neutral-400'
                    : 'bg-white border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[10px] sm:text-xs">
                    Resume Craft • LaTeX Studio
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    ATS Ready
                  </span>
                </div>
              </div>

              {/* Screen Content: Split Workspace (Code / Structure on left, Resume preview on center-right) */}
              <div className="p-3 sm:p-4 grid grid-cols-12 gap-3 items-start min-h-[240px]">
                {/* Left Mini Sidebar / Structure Tree */}
                <div className="hidden sm:flex col-span-4 flex-col gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  <div className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800/60 font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-indigo-500" />
                    <span>sections.tex</span>
                  </div>
                  <div className="pl-2 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>✓</span>
                      <span>header.tex</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>✓</span>
                      <span>experience.tex</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>✓</span>
                      <span>education.tex</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>✓</span>
                      <span>skills.tex</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500">
                      <span className="animate-pulse">▶</span>
                      <span>projects.tex</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80">
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1">
                      Metrics
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium">ATS Match</span>
                      <span className="text-emerald-600 font-bold">96%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[96%]" />
                    </div>
                  </div>
                </div>

                {/* Right / Central Live Resume Document in Laptop View */}
                <div className="col-span-12 sm:col-span-8 flex justify-center">
                  <div
                    className={`w-full max-w-[280px] p-3 sm:p-3.5 rounded-md border shadow-md transition-all ${
                      isDark
                        ? 'bg-white text-neutral-900 border-neutral-200 shadow-neutral-950/40'
                        : 'bg-white text-neutral-900 border-neutral-300 shadow-neutral-400/20'
                    }`}
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {/* Resume Header */}
                    <div className="text-center border-b border-neutral-200 pb-2 mb-2">
                      <h4 className="text-[13px] sm:text-[14px] font-bold text-neutral-900 tracking-tight">
                        ALEXANDER CHEN
                      </h4>
                      <p className="text-[9px] text-neutral-600 italic">
                        Senior Full-Stack & Systems Engineer
                      </p>
                      <p className="text-[8px] text-neutral-500 mt-0.5 tracking-tight font-sans">
                        alex.chen@email.com • +1 (555) 234-5678 • github.com/alexchen
                      </p>
                    </div>

                    {/* Resume Experience Section */}
                    <div className="mb-2">
                      <div className="text-[9px] font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 text-neutral-800 mb-1 flex items-center justify-between">
                        <span>Experience</span>
                        <span className="text-[7.5px] font-sans font-normal text-neutral-400">2021 — Present</span>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <div className="flex items-baseline justify-between text-[8.5px]">
                            <span className="font-bold text-neutral-900">Staff Software Engineer</span>
                            <span className="text-[7.5px] text-neutral-500 font-sans">San Francisco, CA</span>
                          </div>
                          <p className="text-[8px] text-neutral-600 italic">Cloud Infrastructure Co.</p>
                          <ul className="text-[7.5px] text-neutral-700 pl-3 list-disc space-y-0.5 mt-0.5 leading-snug">
                            <li>Architected distributed microservices handling 40M+ daily events.</li>
                            <li>Engineered real-time ATS parsing pipelines reducing latency by 48%.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Resume Education & Skills Section */}
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 text-neutral-800 mb-1">
                        Education & Skills
                      </div>
                      <div className="text-[8px] text-neutral-800 leading-snug">
                        <span className="font-semibold">B.S. Computer Science</span>, UC Berkeley (Honors)
                      </div>
                      <div className="text-[7.5px] text-neutral-600 mt-1 font-sans leading-tight">
                        <span className="font-semibold text-neutral-800">Tech:</span> React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Bottom Base / Keyboard lip */}
          <div
            className={`h-3.5 sm:h-4 w-full rounded-b-xl sm:rounded-b-2xl border-t transition-colors shadow-xl flex items-center justify-center relative ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 shadow-black'
                : 'bg-neutral-300 border-neutral-400 shadow-slate-900/10'
            }`}
          >
            {/* Trackpad notch */}
            <div className="w-16 sm:w-20 h-1 rounded-full bg-neutral-600/40 dark:bg-neutral-900/60" />
          </div>
          {/* Subtle laptop desk reflection */}
          <div
            className={`w-[90%] mx-auto h-2 sm:h-3 rounded-[100%] filter blur-sm ${
              isDark ? 'bg-black/60' : 'bg-slate-400/25'
            }`}
          />
        </div>

        {/* =========================================================================
            SATELLITE FLOATING MOTIFS (Resume sheet, ATS badge, Career tools)
           ========================================================================= */}

        {/* 1. Main Overleaf/LaTeX Floating Resume Sheet (Hovering top-right of laptop) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -12, 0],
                  rotate: [2, 0, 2],
                }
          }
          transition={secondaryFloatTransition}
          className="absolute -top-6 -right-2 sm:-top-8 sm:-right-6 w-36 sm:w-44 p-3 rounded-xl border shadow-xl bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700/80 z-20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-bold">FAANG Path</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-3/4" />
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-full" />
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-5/6" />
          </div>
          <div className="mt-2 pt-1.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[9px] text-neutral-500">
            <span>Score</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">98/100</span>
          </div>
        </motion.div>

        {/* 2. Floating ATS Score Verified Badge (Bottom-left of laptop) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, 8, 0],
                  x: [0, -4, 0],
                }
          }
          transition={floatTransition}
          className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-6 px-3.5 py-2.5 rounded-xl border shadow-lg bg-white/95 dark:bg-neutral-900/95 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 z-20 flex items-center gap-2.5 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold leading-tight flex items-center gap-1">
              <span>ATS Compliant</span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-[9.5px] text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
              100% Recruiter Parseable
            </p>
          </div>
        </motion.div>

        {/* 3. Small Graduation / Career Badge (Top-left) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -6, 0],
                  rotate: [-3, 0, -3],
                }
          }
          transition={{ ...floatTransition, delay: 1.2 }}
          className="hidden sm:flex absolute -top-4 -left-4 p-2 rounded-xl border shadow-md bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 z-20 items-center gap-1.5"
        >
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] font-semibold">Student & Pro Templates</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnimatedResumeHeroVisual;
