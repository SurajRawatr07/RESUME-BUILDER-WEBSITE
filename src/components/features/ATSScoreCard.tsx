import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import {
  calculateATSScore,
  ATSAnalysisResult,
  ROLE_KEYWORD_DICTIONARIES,
} from '@/lib/atsEngine';
import { jobDescriptionStorage } from '@/lib/storage';

interface ATSScoreCardProps {
  resumeData: ResumeData;
  onOpenFullDiagnostic?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
}

export default function ATSScoreCard({
  resumeData,
  onOpenFullDiagnostic,
  onNavigateSection,
  className = '',
}: ATSScoreCardProps) {
  const [debouncedResume, setDebouncedResume] = useState<ResumeData>(resumeData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [targetRole, setTargetRole] = useState(resumeData.jobTitle || 'Full Stack Developer');

  // Debounce resume changes by 300ms for high performance reactive typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedResume(resumeData);
    }, 300);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const savedJD = jobDescriptionStorage.getLatest();
  const analysis: ATSAnalysisResult = useMemo(() => {
    return calculateATSScore(debouncedResume, targetRole, savedJD?.rawText);
  }, [debouncedResume, targetRole, savedJD?.rawText]);

  const { score, status, statusColor, breakdown, strengths, weaknesses, recommendations } = analysis;

  const sectionsList = [
    breakdown.contact,
    breakdown.summary,
    breakdown.skills,
    breakdown.experience,
    breakdown.projects,
    breakdown.education,
    breakdown.keywords,
    breakdown.formatting,
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all overflow-hidden ${className}`}
    >
      {/* Top Header / Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Circular ATS Badge */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-100 dark:text-gray-800"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={119.3}
                strokeDashoffset={119.3 - (119.3 * score) / 100}
                strokeLinecap="round"
                className={`transition-all duration-500 ${
                  score >= 80
                    ? 'text-emerald-500'
                    : score >= 60
                    ? 'text-indigo-600'
                    : 'text-amber-500'
                }`}
                fill="transparent"
              />
            </svg>
            <span className="absolute font-black text-sm text-slate-900 dark:text-white">
              {score}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Live ATS Score
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                {status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Live deterministic ATS readiness score ({score}/100)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullDiagnostic && (
            <button
              onClick={onOpenFullDiagnostic}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              Full Diagnostic <ExternalLink className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-gray-800 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300 transition-colors"
            title={isExpanded ? 'Collapse breakdown' : 'Expand breakdown'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100 dark:border-gray-800 p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-gray-950/30"
          >
            {/* Section Progress Rows */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Section-by-Section Scoring Breakdown:
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {sectionsList.map((sec) => {
                  const pct = Math.round((sec.score / sec.max) * 100);
                  return (
                    <div
                      key={sec.label}
                      className="p-2.5 rounded-xl border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800 dark:text-gray-200 truncate">
                            {sec.label}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 font-bold">
                            {sec.score}/{sec.max}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Weaknesses Quick Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {/* Strengths */}
              <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strengths ({strengths.length})
                </span>
                <ul className="text-xs text-slate-600 dark:text-gray-300 space-y-1">
                  {strengths.slice(0, 3).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-500 font-bold">✓</span> {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses / Action Items */}
              <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Optimization Opportunities ({weaknesses.length})
                </span>
                <ul className="text-xs text-slate-600 dark:text-gray-300 space-y-1">
                  {weaknesses.slice(0, 3).map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-amber-500 font-bold">⚠</span> {wk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable recommendation */}
            {recommendations.length > 0 && (
              <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-[11px] font-medium">{recommendations[0]}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
