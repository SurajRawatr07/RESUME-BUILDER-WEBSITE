import React, { useState, useEffect } from 'react';
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
  Info,
  X
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult } from '@/lib/atsEngine';
import { api } from '@/lib/api';
import { jobDescriptionStorage } from '@/lib/storage';
import { useResumeStore } from '@/stores/resumeStore';
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
  'Analyzing your resume content...',
  'Checking role and title relevance',
  'Matching technical skills & keywords',
  'Evaluating resume sections & ATS format',
];

export default function ATSChecker({
  resumeData,
  onClose,
  isInline = true,
}: ATSCheckerProps) {
  const defaultRole = resumeData.jobTitle || resumeData.targetRole || '';
  const savedJD = jobDescriptionStorage.getLatest();
  const [jobTitle, setJobTitle] = useState(defaultRole);
  const [jobDescription, setJobDescription] = useState(savedJD?.rawText || '');
  const [showJobDescription, setShowJobDescription] = useState(Boolean(savedJD?.rawText));

  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [animatedScore, setAnimatedScore] = useState(0);
  const [resultTab, setResultTab] = useState<'overview' | 'keywords' | 'breakdown'>('overview');

  // Dynamic reactive recalculation whenever resumeData updates while results are displayed
  useEffect(() => {
    if (!analysisResult || isAnalyzing) return;
    const role = analysisResult.targetJobTitle || jobTitle.trim() || 'Software Engineer';
    const updated = calculateATSScore(
      resumeData,
      role,
      jobDescription.trim() || undefined
    );
    setAnalysisResult(updated);
    setAnimatedScore(updated.score);
    try {
      useResumeStore.setState({ atsScore: updated.score });
    } catch {
      // ignore store sync error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  const handleAnalyze = async () => {
    const trimmedTitle = jobTitle.trim();
    if (!trimmedTitle) {
      setError('Please provide a target job title to evaluate against.');
      return;
    }

    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentStepIdx(0);

    const stepDuration = 180;
    ANALYSIS_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentStepIdx(idx);
      }, idx * stepDuration);
    });

    try {
      const res = await api.ats.analyze({
        resumeData,
        targetRole: trimmedTitle,
        jobDescription: jobDescription.trim() || undefined,
      });

      setTimeout(() => {
        if (res.success && res.data) {
          setAnalysisResult(res.data);
          try {
            useResumeStore.setState({ atsScore: res.data.score });
          } catch (syncErr) {
            console.debug('[ATSChecker] Store score sync skipped:', syncErr);
          }
        } else {
          setError('Could not complete ATS evaluation for this resume content.');
        }
        setIsAnalyzing(false);
      }, ANALYSIS_STEPS.length * stepDuration);
    } catch (err) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setError(
          err instanceof Error
            ? err.message
            : 'Analysis failed. Please verify your resume content and try again.'
        );
      }, ANALYSIS_STEPS.length * stepDuration);
    }
  };

  // Animate score counter only when transitioning from null -> result
  useEffect(() => {
    if (!analysisResult) {
      setAnimatedScore(0);
      return;
    }

    const end = analysisResult.score;
    setAnimatedScore(end);
  }, [analysisResult]);

  const handleResetToInput = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentStepIdx(0);
    setError(null);
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
              Estimated ATS-Readiness Analysis
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Simulated client-side diagnostic evaluating keywords, completeness &amp; formatting
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
        {!isAnalyzing && !analysisResult && (
          <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-5">
            <div className="text-center space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Target Role &amp; Estimated ATS-Readiness Check
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Enter the job title you&apos;re targeting to run a transparent client-side diagnostic against role keywords, section completeness, and ATS formatting rules.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Analysis Failed</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <label
                htmlFor="target-job-title-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Target Job Title *
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Input
                    id="target-job-title-input"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      if (error) setError(null);
                    }}
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
                  id="ats-start-analysis-btn"
                  onClick={handleAnalyze}
                  disabled={!jobTitle.trim() || isAnalyzing}
                  className="h-11 px-6 rounded-xl font-semibold text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <span>Check ATS Readiness</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Or pick a role to evaluate:
              </span>
              <div className="flex flex-wrap gap-2">
                {COMMON_EXAMPLE_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setJobTitle(role);
                      if (error) setError(null);
                    }}
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowJobDescription(!showJobDescription)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showJobDescription ? '− Hide Job Description' : '+ Add Job Description (Optional - match job posting)'}</span>
              </button>

              {showJobDescription && (
                <div className="mt-2.5 space-y-1.5">
                  <textarea
                    id="ats-job-description-input"
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description or requirements here to check for posting-specific keywords..."
                    className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    If provided, the diagnostic matches terms from this posting against your resume text.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                  About This Estimated ATS-Readiness Score
                </p>
                <p className="leading-relaxed">
                  Calculates an estimated ATS-readiness score across 6 weighted factors: Job Title Relevance (20), Keyword Match (30), Content Completeness (15), Experience &amp; Projects (15), Education &amp; Certifications (10), and Clean Formatting (10). This is a simulated heuristic check and not an official third-party ATS score.
                </p>
              </div>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 animate-spin" />

            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Evaluating against &ldquo;{jobTitle}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Running deterministic ATS-readiness checks...
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

        {analysisResult && (
          <div className="space-y-6">
            {/* Estimated Disclaimer Banner */}
            <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                {analysisResult.estimationNote ||
                  'Estimated ATS-readiness score calculated locally from keyword match, section completeness, and formatting checks. Not an official third-party ATS score.'}{' '}
                Score recalculates automatically as you edit your resume.
              </span>
            </div>

            {/* Target Role & Re-analyze Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70">
              <div className="flex items-center gap-2 flex-wrap">
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
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  ESTIMATED ATS-READINESS
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
                    ? 'Strong alignment across target keywords, clean formatting, and structured experience.'
                    : analysisResult.score >= 60
                    ? 'Solid baseline readiness. Adding relevant skills and clarifying descriptions will improve alignment.'
                    : 'Target role alignment, missing keywords, or section completeness need attention.'}
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
                    TOTAL ESTIMATED ATS-READINESS
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

            {resultTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p className="text-xs text-neutral-400 italic">Resume meets all standard ATS-readiness checks for this role.</p>
                    )}
                  </div>
                </div>

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

            {resultTab === 'keywords' && (
              <div className="space-y-5">
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
                    Incorporate any missing keywords you genuinely have experience with into your Skills, Experience descriptions, or Projects:
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

      {!isInline && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {analysisResult
              ? `Analysis complete for ${analysisResult.targetJobTitle}`
              : 'Enter job title and click Check ATS Readiness'}
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
