import { useState, useMemo } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  Layers,
  FileDiff,
  Info
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { versionStorage, ResumeVersion } from '@/lib/storage';
import { compareTwoResumes, ResumeComparisonResult } from '@/lib/resumeComparator';

interface ResumeComparisonProps {
  currentResumeId: string;
  currentResumeData: ResumeData;
  onApplyVersion?: (version: ResumeVersion) => void;
}

const LIVE_OPTION_ID = '__current_live_resume__';

export default function ResumeComparison({
  currentResumeId,
  currentResumeData,
}: ResumeComparisonProps) {
  const versions = useMemo(() => {
    return versionStorage.getVersions(currentResumeId || 'default-resume');
  }, [currentResumeId]);

  const [versionAId, setVersionAId] = useState<string>(
    versions[0]?.id || LIVE_OPTION_ID
  );
  const [versionBId, setVersionBId] = useState<string>(
    versions[1]?.id || LIVE_OPTION_ID
  );

  const resolveResume = (id: string, fallbackName: string) => {
    if (id === LIVE_OPTION_ID) {
      return {
        id: LIVE_OPTION_ID,
        name: 'Current Live Editor Resume',
        resumeData: currentResumeData,
        targetRole: currentResumeData?.jobTitle || 'Software Engineer',
      };
    }
    const found = versions.find((v) => v.id === id);
    if (found) return found;
    return {
      id: 'fallback',
      name: fallbackName,
      resumeData: currentResumeData,
      targetRole: currentResumeData?.jobTitle || 'Software Engineer',
    };
  };

  const versionA = useMemo(
    () => resolveResume(versionAId, 'Baseline Resume'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [versions, versionAId, currentResumeData]
  );

  const versionB = useMemo(
    () => resolveResume(versionBId, 'Comparison Target'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [versions, versionBId, currentResumeData]
  );

  const comparison: ResumeComparisonResult = useMemo(() => {
    return compareTwoResumes(
      versionA.resumeData,
      versionB.resumeData,
      versionB.targetRole || versionA.targetRole || 'Software Engineer'
    );
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
                Section-by-section content diff and estimated ATS-readiness comparison between any saved snapshot and your live resume.
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
              id="compare-select-a"
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              <option value={LIVE_OPTION_ID}>Current Live Editor Resume</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.targetRole}) — Est. {v.atsScore}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900">
            <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1.5">
              Comparison Target (Resume B):
            </label>
            <select
              id="compare-select-b"
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              <option value={LIVE_OPTION_ID}>Current Live Editor Resume</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.targetRole}) — Est. {v.atsScore}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Identical Version Notice */}
      {comparison.isIdentical && (
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 p-4 flex items-center gap-3 text-xs text-slate-700 dark:text-gray-300">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>No differences detected</strong> — Resume A and Resume B currently have identical content across all sections. Select two different snapshots or edit your live resume to inspect section-by-section diffs.
          </span>
        </div>
      )}

      {/* Primary Score Delta Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-gray-950/70 border border-slate-100 dark:border-gray-800">
            <span className="text-xs text-slate-500 dark:text-gray-400 font-medium block">
              {versionA.name}
            </span>
            <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {comparison.scoreA}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block mt-1">
              Est. Readiness · {comparison.statusA}
            </span>
          </div>

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
                {comparison.scoreDiff > 0
                  ? `+${comparison.scoreDiff} pts change`
                  : comparison.scoreDiff < 0
                  ? `${comparison.scoreDiff} pts change`
                  : 'Same estimated score'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {comparison.totalSectionChanges} section(s) changed
              </span>
            </div>
          </div>

          <div className="text-center p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
            <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium block">
              {versionB.name}
            </span>
            <div className="text-3xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
              {comparison.scoreB}
              <span className="text-sm font-normal text-indigo-400">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 block mt-1">
              Est. Readiness · {comparison.statusB}
            </span>
          </div>
        </div>
      </div>

      {/* Section-by-Section Content Diff */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileDiff className="w-4 h-4 text-indigo-600" />
            Section-by-Section Content Comparison
          </h4>
          <span className="text-xs text-slate-500 dark:text-gray-400">
            {comparison.totalSectionChanges === 0
              ? 'All 7 sections identical'
              : `${comparison.totalSectionChanges} section(s) differ`}
          </span>
        </div>

        <div className="space-y-3">
          {comparison.sectionDiffs.map((sec) => (
            <div
              key={sec.id}
              className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/40 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {sec.sectionName}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    sec.status === 'identical'
                      ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                      : sec.status === 'added'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                      : sec.status === 'removed'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  }`}>
                    {sec.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-gray-400">
                  {sec.summaryText}
                </span>
              </div>

              {sec.changes.length > 0 && (
                <div className="space-y-2 pt-1">
                  {sec.changes.map((chg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        chg.changeType === 'added'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : chg.changeType === 'removed'
                          ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-slate-900 dark:text-white">{chg.label}</strong>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {chg.changeType}
                        </span>
                      </div>

                      {chg.before && (
                        <div className="p-2 rounded bg-rose-100/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 whitespace-pre-wrap">
                          <span className="font-bold mr-1">- Before:</span>
                          {chg.before}
                        </div>
                      )}
                      {chg.after && (
                        <div className="p-2 rounded bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap">
                          <span className="font-bold mr-1">+ After:</span>
                          {chg.after}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Diff Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Skills Delta
        </h4>

        <div className="grid md:grid-cols-3 gap-4">
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

          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-2">
              <MinusCircle className="w-4 h-4 text-rose-600" /> Removed in B ({comparison.skillsRemoved.length})
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

          <div className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Shared Skills ({comparison.skillsCommon.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.skillsCommon.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
              {comparison.skillsCommon.length > 12 && (
                <span className="text-xs text-slate-400">
                  +{comparison.skillsCommon.length - 12} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
