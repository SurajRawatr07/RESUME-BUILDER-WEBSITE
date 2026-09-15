import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import { analyzeResumeHealth, ResumeHealthAnalysis, HealthPillar } from '@/lib/resumeHealth';
import { jobDescriptionStorage } from '@/lib/storage';

interface ResumeHealthDashboardProps {
  resumeData: ResumeData;
  onNavigateSection?: (sectionId: string) => void;
  onOpenContentAssistant?: () => void;
  onOpenJobMatcher?: () => void;
}

export default function ResumeHealthDashboard({
  resumeData,
  onNavigateSection,
  onOpenContentAssistant,
  onOpenJobMatcher,
}: ResumeHealthDashboardProps) {
  const savedJD = jobDescriptionStorage.getLatest();
  const health: ResumeHealthAnalysis = analyzeResumeHealth(
    resumeData,
    resumeData.jobTitle || 'Full Stack Developer',
    savedJD?.rawText
  );

  const pillarsList: HealthPillar[] = Object.values(health.pillars);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Health Score Dial */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-gray-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * health.overallHealthScore) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ${
                    health.overallHealthScore >= 85
                      ? 'text-emerald-500'
                      : health.overallHealthScore >= 70
                      ? 'text-indigo-600'
                      : 'text-amber-500'
                  }`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {health.overallHealthScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Health
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" /> Resume Health Matrix
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  health.overallHealthScore >= 85
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
                }`}>
                  {health.overallHealthScore >= 85 ? 'Job Market Ready' : 'Optimization In Progress'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Synthesized across 6 core criteria: Completeness, Quantifiable Impact, Keywords, Formatting, and Content Quality.
              </p>

              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-gray-300">
                  ATS Score: <strong>{health.atsScore}/100</strong>
                </span>
                {health.jobMatchScore !== null && (
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    JD Match: <strong>{health.jobMatchScore}%</strong>
                  </span>
                )}
                <span className="text-slate-400">
                  Readiness: <strong>{health.readinessScore}%</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {onOpenContentAssistant && (
              <Button
                onClick={onOpenContentAssistant}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Content Assistant
              </Button>
            )}
            {onOpenJobMatcher && (
              <Button
                onClick={onOpenJobMatcher}
                size="sm"
                className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Target JD Match
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 6 Core Pillars Progress Breakdown */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillarsList.map((pillar) => (
          <div
            key={pillar.id}
            className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {pillar.name}
              </span>
              <span className={`text-xs font-black ${
                pillar.score >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : pillar.score >= 60
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {pillar.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  pillar.score >= 80
                    ? 'bg-emerald-500'
                    : pillar.score >= 60
                    ? 'bg-indigo-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${pillar.score}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              {pillar.feedback}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{pillar.actionableHint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real Actionable Recommendations List */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Prioritized Action Items for This Resume
        </h4>

        <div className="space-y-2.5">
          {health.readinessChecklist.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                item.status === 'passed'
                  ? 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/50'
                  : item.status === 'warning'
                  ? 'bg-amber-50/40 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
                  : 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                    item.status === 'warning' ? 'text-amber-500' : 'text-rose-500'
                  }`} />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.status === 'passed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                    {item.detail}
                  </p>
                  {item.status !== 'passed' && item.recommendation && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> {item.recommendation}
                    </p>
                  )}
                </div>
              </div>

              {item.actionTarget && onNavigateSection && item.status !== 'passed' && (
                <button
                  onClick={() => onNavigateSection(item.actionTarget!)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 shrink-0 self-center"
                >
                  Edit Section
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
