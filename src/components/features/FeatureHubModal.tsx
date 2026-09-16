import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Target,
  FileCheck,
  Sparkles,
  GitBranch,
  GitCompare,
  Activity,
  UploadCloud,
  ShieldCheck,
  Search
} from 'lucide-react';
import { ResumeData, TemplateType } from '@/types/resume';
import { ResumeVersion } from '@/lib/storage';
import JobMatcher from './JobMatcher';
import KeywordGapAnalyzer from './KeywordGapAnalyzer';
import ContentAssistant from './ContentAssistant';
import ResumeVersionManager from './ResumeVersionManager';
import ResumeComparison from './ResumeComparison';
import ResumeHealthDashboard from './ResumeHealthDashboard';
import ResumeImporter from './ResumeImporter';
import ATSChecker from './forms/ATSChecker';

export type FeatureModalTab =
  | 'job_matcher'
  | 'keyword_gap'
  | 'ats_diagnostic'
  | 'content_assistant'
  | 'versions'
  | 'comparison'
  | 'health_dashboard'
  | 'import_resume';

interface FeatureHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: FeatureModalTab;
  currentTab: FeatureModalTab;
  onTabChange: (tab: FeatureModalTab) => void;
  resumeData: ResumeData;
  currentResumeId: string;
  currentResumeTitle: string;
  currentTemplate: TemplateType;
  atsScore: number;
  onApplyContentAssistant: (newText: string, sectionType: string) => void;
  onApplyImportedData: (data: Partial<ResumeData>) => void;
  onSelectVersion: (version: ResumeVersion) => void;
  onOpenReadinessModal?: () => void;
}

export default function FeatureHubModal({
  isOpen,
  onClose,
  currentTab,
  onTabChange,
  resumeData,
  currentResumeId,
  currentResumeTitle,
  currentTemplate,
  atsScore,
  onApplyContentAssistant,
  onApplyImportedData,
  onSelectVersion,
  onOpenReadinessModal,
}: FeatureHubModalProps) {
  if (!isOpen) return null;

  const tabs: Array<{ id: FeatureModalTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'job_matcher', label: 'JD Matcher', icon: <Search className="w-4 h-4" /> },
    { id: 'keyword_gap', label: 'Keyword Gap', icon: <Target className="w-4 h-4" /> },
    { id: 'ats_diagnostic', label: 'ATS Score', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'content_assistant', label: 'Content Assistant', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'versions', label: 'Versions', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'comparison', label: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'health_dashboard', label: 'Resume Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'import_resume', label: 'Import', icon: <UploadCloud className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 shadow-2xl overflow-hidden my-auto"
      >
        {/* Hub Header */}
        <div className="px-5 py-3.5 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                Resume Craft Intelligence Suite
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                100% Client-Side ATS Scoring, Keyword Gap Modeling & Real Document Tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReadinessModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReadinessModal();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pre-Flight Check
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Navigation Bar */}
        <div className="px-4 py-2 bg-slate-100/80 dark:bg-gray-900/60 border-b border-slate-200 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {currentTab === 'job_matcher' && (
                <JobMatcher
                  resumeData={resumeData}
                  onOpenKeywordGap={() => onTabChange('keyword_gap')}
                />
              )}

              {currentTab === 'keyword_gap' && (
                <KeywordGapAnalyzer resumeData={resumeData} />
              )}

              {currentTab === 'ats_diagnostic' && (
                <ATSChecker resumeData={resumeData} onClose={onClose} />
              )}

              {currentTab === 'content_assistant' && (
                <ContentAssistant
                  resumeData={resumeData}
                  onApplyImprovement={onApplyContentAssistant}
                  onClose={onClose}
                />
              )}

              {currentTab === 'versions' && (
                <ResumeVersionManager
                  currentResumeId={currentResumeId}
                  currentResumeTitle={currentResumeTitle}
                  currentResumeData={resumeData}
                  currentTemplate={currentTemplate}
                  atsScore={atsScore}
                  onSelectVersion={onSelectVersion}
                  onClose={onClose}
                />
              )}

              {currentTab === 'comparison' && (
                <ResumeComparison
                  currentResumeId={currentResumeId}
                  currentResumeData={resumeData}
                />
              )}

              {currentTab === 'health_dashboard' && (
                <ResumeHealthDashboard
                  resumeData={resumeData}
                  onOpenContentAssistant={() => onTabChange('content_assistant')}
                  onOpenJobMatcher={() => onTabChange('job_matcher')}
                />
              )}

              {currentTab === 'import_resume' && (
                <ResumeImporter
                  onApplyImportedData={onApplyImportedData}
                  onClose={onClose}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
