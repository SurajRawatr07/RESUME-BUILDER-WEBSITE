import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  FileEdit,
  Sparkles,
  ShieldCheck,
  Award,
  X,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import { analyzeResumeHealth } from '@/lib/resumeHealth';
import { jobDescriptionStorage } from '@/lib/storage';

interface ResumeReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onEditResume: () => void;
  onImproveResume: () => void;
  onPreviewResume: () => void;
  onDownloadPDF: () => void;
}

export default function ResumeReadinessModal({
  isOpen,
  onClose,
  resumeData,
  onEditResume,
  onImproveResume,
  onPreviewResume,
  onDownloadPDF,
}: ResumeReadinessModalProps) {
  if (!isOpen) return null;

  const savedJD = jobDescriptionStorage.getLatest();
  const health = analyzeResumeHealth(
    resumeData,
    resumeData.jobTitle || 'Full Stack Developer',
    savedJD?.rawText
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-6 sm:p-8 my-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Resume Readiness & Pre-Flight Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Final pre-application audit before dispatching to recruiters or job boards.
            </p>
          </div>
        </div>

        {/* Readiness Score Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-100 dark:text-gray-800"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * health.readinessScore) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-700 ${
                      health.readinessScore >= 85
                        ? 'text-emerald-500'
                        : health.readinessScore >= 70
                        ? 'text-indigo-600'
                        : 'text-amber-500'
                    }`}
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {health.readinessScore}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    Score
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Readiness Rating
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {health.readinessScore >= 85 ? 'Ready to Apply' : 'Optimization Recommended'}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>ATS Score: <strong className="text-slate-800 dark:text-gray-200">{health.atsScore} / 100</strong></span>
                  {health.jobMatchScore !== null && (
                    <span>JD Match: <strong className="text-indigo-600 dark:text-indigo-400">{health.jobMatchScore}%</strong></span>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                health.readinessScore >= 85
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
              }`}>
                {health.readinessScore >= 85 ? 'All Core Checks Passed' : 'Action Items Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Readiness Checklist */}
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
          <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block">
            Application Verification Checklist:
          </span>
          <div className="grid sm:grid-cols-2 gap-2">
            {health.readinessChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  item.status === 'passed'
                    ? 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-slate-800 dark:text-gray-200'
                    : 'bg-amber-50/40 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-semibold">{item.label}</strong>
                  <span className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                    {item.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Recommendations */}
        {health.topRecommendations.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 mb-6 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Key Action Recommendation:
            </span>
            <p className="text-xs text-slate-600 dark:text-gray-300">
              {health.topRecommendations[0]}
            </p>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEditResume();
              }}
              className="rounded-xl text-xs font-semibold flex-1 sm:flex-initial"
            >
              <FileEdit className="w-3.5 h-3.5 mr-1" /> Edit Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onImproveResume();
              }}
              className="rounded-xl text-xs font-semibold flex-1 sm:flex-initial"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Assistant
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose();
                onPreviewResume();
              }}
              className="rounded-xl text-xs font-semibold flex-1 sm:flex-initial"
            >
              <Eye className="w-3.5 h-3.5 mr-1" /> Preview
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onDownloadPDF();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex-1 sm:flex-initial"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
