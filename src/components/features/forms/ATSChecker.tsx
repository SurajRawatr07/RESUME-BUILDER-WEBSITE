import { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  FileCheck,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/types/resume';
import {
  calculateATSScore,
  ROLE_KEYWORD_DICTIONARIES,
  ATSAnalysisResult,
} from '@/lib/atsEngine';

interface ATSCheckerProps {
  resumeData: ResumeData;
  onClose: () => void;
}

export default function ATSChecker({ resumeData, onClose }: ATSCheckerProps) {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'keywords'>('overview');

  const analysis: ATSAnalysisResult = useMemo(() => {
    return calculateATSScore(resumeData, targetRole, jobDescription);
  }, [resumeData, targetRole, jobDescription]);

  const { score, status, statusColor, breakdown, strengths, weaknesses, missingKeywords, matchedKeywords, recommendations } = analysis;

  const roles = Object.keys(ROLE_KEYWORD_DICTIONARIES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  ATS Resume Diagnostic
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Deterministic ATS compatibility and keyword coverage analyzer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Configuration Bar */}
        <div className="p-4 sm:px-6 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <Label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              Target Career Role:
            </Label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'sections'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sections ({Object.keys(breakdown).length})
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'keywords'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Keywords ({matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length})
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Score Hero Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/60 dark:border-indigo-800/40 flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
                    ATS Readiness Score
                  </span>
                  <div className="text-5xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
                    {score}
                    <span className="text-lg font-normal text-slate-400 dark:text-gray-500">/100</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                    {status}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-3 leading-relaxed">
                    {score >= 80
                      ? 'High probability of passing applicant tracking filters.'
                      : score >= 60
                      ? 'Solid foundation. A few adjustments will significantly improve interview callbacks.'
                      : 'Follow recommendations below to optimize keyword density and section structure.'}
                  </p>
                </div>

                <div className="md:col-span-2 flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2">
                      Key Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-gray-300">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400">
                      Matched: <strong className="text-emerald-600 dark:text-emerald-400">{matchedKeywords.length} keywords</strong>
                    </span>
                    <span className="text-slate-500 dark:text-gray-400">
                      Missing: <strong className="text-rose-500">{missingKeywords.length} recommended</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-gray-300">
                    {strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
                  <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>Areas for Improvement</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-gray-300">
                    {weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Custom Job Description Comparator */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50">
                <Label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                  Optional: Compare with Specific Job Description
                </Label>
                <Textarea
                  placeholder="Paste a specific job posting here to analyze exact custom keyword matching..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-2 text-xs min-h-[70px] bg-white dark:bg-gray-900"
                />
              </div>
            </>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-3">
              {Object.entries(breakdown).map(([key, item]) => {
                const percentage = Math.round((item.score / item.max) * 100);
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                          {item.score} / {item.max} pts
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            percentage >= 80
                              ? 'bg-emerald-500'
                              : percentage >= 50
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1.5">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-6">
              {/* Matched Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Matched Target Keywords ({matchedKeywords.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.length > 0 ? (
                    matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None detected in resume text</span>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Missing Recommended Keywords ({missingKeywords.length})</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
                  Consider naturally integrating relevant missing keywords into your Skills, Experience, or Project descriptions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-950/80">
          <span className="text-xs text-slate-500 dark:text-gray-400">
            Updates in real-time as you refine your resume sections.
          </span>
          <Button onClick={onClose} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
