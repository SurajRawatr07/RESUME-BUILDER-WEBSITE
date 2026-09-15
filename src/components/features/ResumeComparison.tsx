import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Layers,
  Award,
  Briefcase
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { versionStorage, ResumeVersion } from '@/lib/storage';
import { compareTwoResumes, ResumeComparisonResult } from '@/lib/resumeComparator';

interface ResumeComparisonProps {
  currentResumeId: string;
  currentResumeData: ResumeData;
  onApplyVersion?: (version: ResumeVersion) => void;
}

export default function ResumeComparison({
  currentResumeId,
  currentResumeData,
}: ResumeComparisonProps) {
  const versions = useMemo(() => {
    return versionStorage.getVersions(currentResumeId || 'default-resume');
  }, [currentResumeId]);

  const [versionAId, setVersionAId] = useState<string>(
    versions[0]?.id || 'vA'
  );
  const [versionBId, setVersionBId] = useState<string>(
    versions[1]?.id || versions[0]?.id || 'vB'
  );

  const versionA = useMemo(() => {
    return versions.find((v) => v.id === versionAId) || {
      id: 'current',
      name: 'Current Working Resume',
      resumeData: currentResumeData,
      targetRole: currentResumeData.jobTitle || 'Full Stack Developer',
      atsScore: 78,
    };
  }, [versions, versionAId, currentResumeData]);

  const versionB = useMemo(() => {
    return versions.find((v) => v.id === versionBId) || {
      id: 'compare',
      name: versions[1]?.name || 'Secondary Version',
      resumeData: versions[1]?.resumeData || currentResumeData,
      targetRole: versions[1]?.targetRole || 'Frontend Developer',
      atsScore: 85,
    };
  }, [versions, versionBId, currentResumeData]);

  const comparison: ResumeComparisonResult = useMemo(() => {
    return compareTwoResumes(versionA.resumeData, versionB.resumeData, versionB.targetRole || 'Full Stack Developer');
  }, [versionA, versionB]);

  return (
    <div className="space-y-6">
      {/* Selector Header Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Resume Version Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Visual delta analysis comparing ATS scoring, keyword alignment, and section improvements.
              </p>
            </div>
          </div>
        </div>

        {/* Dropdown Pickers */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Baseline (Resume A):
            </label>
            <select
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.targetRole}) - ATS {v.atsScore}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
            <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1.5">
              Comparison Target (Resume B):
            </label>
            <select
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.targetRole}) - ATS {v.atsScore}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Primary Score Delta Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Version A Score */}
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-gray-950/70 border border-slate-100 dark:border-gray-800">
            <span className="text-xs text-slate-500 dark:text-gray-400 font-medium block">
              Resume A (Baseline)
            </span>
            <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {comparison.scoreA}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block mt-1">
              {comparison.statusA}
            </span>
          </div>

          {/* Delta Indicator */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs border ${
              comparison.scoreDiff > 0
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800'
                : comparison.scoreDiff < 0
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-gray-800'
            }`}>
              {comparison.scoreDiff > 0 ? (
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              ) : comparison.scoreDiff < 0 ? (
                <TrendingDown className="w-6 h-6 text-rose-600" />
              ) : (
                <Minus className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="mt-2">
              <span className={`text-sm font-extrabold ${
                comparison.scoreDiff > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : comparison.scoreDiff < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500'
              }`}>
                {comparison.scoreDiff > 0 ? `+${comparison.scoreDiff} pts improvement` : comparison.scoreDiff < 0 ? `${comparison.scoreDiff} pts decline` : 'Identical score'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Deterministic ATS differential
              </span>
            </div>
          </div>

          {/* Version B Score */}
          <div className="text-center p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
            <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium block">
              Resume B (Target)
            </span>
            <div className="text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
              {comparison.scoreB}
              <span className="text-sm font-normal text-indigo-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 block mt-1">
              {comparison.statusB}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Diff Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Skills Delta
        </h4>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Added Skills in B */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" /> Added Skills in B ({comparison.skillsAdded.length})
            </span>
            {comparison.skillsAdded.length === 0 ? (
              <span className="text-xs text-slate-400">No new skills added</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {comparison.skillsAdded.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                  >
                    +{skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Removed Skills in B */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
              <MinusCircle className="w-4 h-4 text-rose-600" /> Missing / Removed in B ({comparison.skillsRemoved.length})
            </span>
            {comparison.skillsRemoved.length === 0 ? (
              <span className="text-xs text-slate-400">No skills removed</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {comparison.skillsRemoved.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200"
                  >
                    -{skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Common Skills */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Shared Competencies ({comparison.skillsCommon.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.skillsCommon.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
              {comparison.skillsCommon.length > 10 && (
                <span className="text-xs text-slate-400">
                  +{comparison.skillsCommon.length - 10} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section Improvements vs Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Improved Sections */}
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Improved Sections in Version B
          </h4>
          {comparison.improvedSections.length === 0 ? (
            <p className="text-xs text-slate-400">No sections showed positive score divergence.</p>
          ) : (
            <div className="space-y-2">
              {comparison.improvedSections.map((sec) => (
                <div
                  key={sec.name}
                  className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {sec.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +{sec.diff} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weaker Sections */}
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" /> Weaker Sections in Version B
          </h4>
          {comparison.weakerSections.length === 0 ? (
            <p className="text-xs text-slate-400">No sections declined in version B.</p>
          ) : (
            <div className="space-y-2">
              {comparison.weakerSections.map((sec) => (
                <div
                  key={sec.name}
                  className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {sec.name}
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {sec.diff} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
