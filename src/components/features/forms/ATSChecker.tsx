import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult } from '@/lib/atsEngine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ATSCheckerProps {
  resumeData: ResumeData;
  onClose?: () => void;
  isInline?: boolean;
}

const COMMON_EXAMPLE_ROLES = [
  'Frontend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'React Developer',
  'Backend Developer',
  'Data Analyst',
];

const ANALYSIS_STEPS = [
  'Analyzing your resume...',
  'Checking role relevance',
  'Matching keywords',
  'Evaluating resume structure',
];

export default function ATSChecker({
  resumeData,
  onClose,
  isInline = false,
}: ATSCheckerProps) {
  // Target Job Title input state
  const [jobTitle, setJobTitle] = useState('');
  
  // Analysis result state - null until user explicitly clicks "Analyze Resume"
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  
  // Loading & step progression state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Animated score counter for visualization
  const [animatedScore, setAnimatedScore] = useState(0);

  // Active tab within results view: 'overview' | 'keywords' | 'breakdown'
  const [resultTab, setResultTab] = useState<'overview' | 'keywords' | 'breakdown'>('overview');

  const handleAnalyze = () => {
    const trimmed = jobTitle.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    setCurrentStepIdx(0);
    setAnalysisResult(null);

    // Step-by-step realistic feedback transitions (~800ms total)
    const stepDuration = 200;
    ANALYSIS_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentStepIdx(idx);
      }, idx * stepDuration);
    });

    setTimeout(() => {
      // Deterministic calculation against the CURRENT resume data and entered job title
      const result = calculateATSScore(resumeData, trimmed);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, ANALYSIS_STEPS.length * stepDuration);
  };

  // Animate score counter when analysisResult is ready
  useEffect(() => {
    if (!analysisResult) {
      setAnimatedScore(0);
      return;
    }

    let start = 0;
    const end = analysisResult.score;
    const duration = 600; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [analysisResult]);

  const handleResetToInput = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentStepIdx(0);
  };

  const content = (
    <div className="w-full max-w-4xl mx-auto flex flex-col max-h-[85vh] bg-white dark:bg-[#111111] text-neutral-900 dark:text-neutral-100 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
              ATS Resume Analysis
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Role-targeted deterministic ATS scoring & keyword gap analysis
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ========================================================= */}
        {/* STEP 3 — ASK FOR JOB TITLE (Before Analysis)              */}
        {/* ========================================================= */}
        {!isAnalyzing && !analysisResult && (
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Target Role Evaluation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Enter the job title you&apos;re targeting so we can evaluate how well your resume matches the role.
              </p>
            </div>

            {/* Input Field */}
            <div className="space-y-3 pt-2">
              <label
                htmlFor="target-job-title-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Enter Job Title
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Input
                    id="target-job-title-input"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && jobTitle.trim()) {
                        handleAnalyze();
                      }
                    }}
                    placeholder='e.g. "Frontend Developer", "Full Stack Developer", "Software Engineer"'
                    className="h-11 px-4 text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"
                    autoFocus
                  />
                  {jobTitle && (
                    <button
                      type="button"
                      onClick={() => setJobTitle('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!jobTitle.trim() || isAnalyzing}
                  className="h-11 px-6 rounded-xl font-semibold text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Example Role Chips */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Or pick a common role to test:
              </span>
              <div className="flex flex-wrap gap-2">
                {COMMON_EXAMPLE_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobTitle(role)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      jobTitle === role
                        ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Real deterministic evaluation
                </p>
                <p className="leading-relaxed">
                  The ATS analysis checks your current resume content against 6 measurable factors: Job Title Relevance, Skills & Keyword Match, Content Completeness, Experience Relevance, Education & Certifications, and ATS Formatting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4 — LOADING STATE (During Analysis)                  */}
        {/* ========================================================= */}
        {isAnalyzing && (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 animate-spin" />

            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Evaluating against &ldquo;{jobTitle}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Please wait while we perform deterministic ATS parsing...
              </p>
            </div>

            <div className="space-y-2 text-left bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 text-xs transition-opacity ${
                      isCurrent
                        ? 'font-bold text-neutral-900 dark:text-white'
                        : isPassed
                        ? 'text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-400 dark:text-neutral-600 opacity-60'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5–8 — RESULT & BREAKDOWN (Only After Analysis)       */}
        {/* ========================================================= */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Target Role & Re-analyze Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Target Role:</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
                  {analysisResult.targetJobTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToInput}
                  className="h-8 text-xs font-semibold rounded-lg border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  <span>Change Role</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  className="h-8 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  <span>Re-analyze</span>
                </Button>
              </div>
            </div>

            {/* Score Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score Display Card */}
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  ATS SCORE
                </span>

                <div className="text-5xl font-black tracking-tight text-neutral-900 dark:text-white my-2">
                  {animatedScore}
                  <span className="text-lg font-normal text-neutral-400 dark:text-neutral-500 ml-1">
                    / 100
                  </span>
                </div>

                <div
                  className={`mt-1 px-3 py-1 rounded-full text-xs font-bold border ${analysisResult.statusColor}`}
                >
                  {analysisResult.status}
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed max-w-xs">
                  {analysisResult.score >= 80
                    ? 'Strong candidate match with high probability of clearing automated ATS filters.'
                    : analysisResult.score >= 60
                    ? 'Solid base match. Incorporating missing keywords and metrics will improve callback probability.'
                    : 'Target title relevance and keyword coverage require improvement for this role.'}
                </p>
              </div>

              {/* 6-Factor Summary Card */}
              <div className="md:col-span-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    Scoring Breakdown Summary
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Job Title Relevance</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.jobTitleRelevance.score} / 20
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Keyword Match</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.keywordMatch.score} / 30
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Content Completeness</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.contentCompleteness.score} / 15
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Experience / Projects</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.experienceProjects.score} / 15
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">Education &amp; Certifications</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.educationCertifications.score} / 10
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">ATS Formatting</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {analysisResult.breakdown.atsFormatting.score} / 10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    TOTAL ATS SCORE
                  </span>
                  <span className="font-bold text-sm text-neutral-900 dark:text-white">
                    {analysisResult.score} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Results Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold w-fit">
              <button
                onClick={() => setResultTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  resultTab === 'overview'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Overview &amp; Action Plan
              </button>
              <button
                onClick={() => setResultTab('keywords')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  resultTab === 'keywords'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>Keywords</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                  {analysisResult.matchedKeywords.length}/{analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length}
                </span>
              </button>
              <button
                onClick={() => setResultTab('breakdown')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  resultTab === 'breakdown'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Detailed Factor Breakdown
              </button>
            </div>

            {/* Tab: Overview & Action Plan */}
            {resultTab === 'overview' && (
              <div className="space-y-4">
                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Strengths</span>
                    </h4>
                    {analysisResult.strengths.length > 0 ? (
                      <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                        {analysisResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
                            <span className="leading-relaxed">{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">No significant strengths detected for this role title.</p>
                    )}
                  </div>

                  {/* Improvements */}
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
                      <span>Improvements</span>
                    </h4>
                    {analysisResult.recommendations.length > 0 ? (
                      <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                        {analysisResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-neutral-400 italic">Resume meets all standard ATS checks for this role.</p>
                    )}
                  </div>
                </div>

                {/* Quick Keyword Gap Glance */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Keyword Match Ratio:{' '}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Matched <strong className="text-neutral-900 dark:text-white">{analysisResult.matchedKeywords.length}</strong> of{' '}
                      {analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length} target role terms
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResultTab('keywords')}
                    className="h-7 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white p-0 hover:bg-transparent"
                  >
                    <span>View all keywords</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Keywords Gap */}
            {resultTab === 'keywords' && (
              <div className="space-y-5">
                {/* Matched Keywords */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Matched Keywords ({analysisResult.matchedKeywords.length})</span>
                    </h4>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Detected in your resume
                    </span>
                  </div>

                  {analysisResult.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">No target role keywords found in the resume.</p>
                  )}
                </div>

                {/* Missing / Recommended Keywords */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                      <span>Missing / Recommended Keywords ({analysisResult.missingKeywords.length})</span>
                    </h4>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Recommended for &ldquo;{analysisResult.targetJobTitle}&rdquo;
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Naturally incorporate relevant missing keywords that you have experience with into your Skills, Experience descriptions, or Projects:
                  </p>

                  {analysisResult.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      All standard target role keywords matched!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Detailed Factor Breakdown */}
            {resultTab === 'breakdown' && (
              <div className="space-y-3">
                {[
                  analysisResult.breakdown.jobTitleRelevance,
                  analysisResult.breakdown.keywordMatch,
                  analysisResult.breakdown.contentCompleteness,
                  analysisResult.breakdown.experienceProjects,
                  analysisResult.breakdown.educationCertifications,
                  analysisResult.breakdown.atsFormatting,
                ].map((item) => {
                  const pct = Math.round((item.score / item.max) * 100);

                  return (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {item.label}
                        </span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {item.score} / {item.max} pts
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {item.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isInline && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {analysisResult
              ? `Analysis complete for ${analysisResult.targetJobTitle}`
              : 'Enter job title and click Analyze Resume'}
          </span>

          <div className="flex items-center gap-2">
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs font-semibold border-neutral-300 dark:border-neutral-700"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      {content}
    </div>
  );
}
