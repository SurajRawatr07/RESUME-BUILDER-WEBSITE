import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  FileText,
  Copy,
  Check,
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/types/resume';
import {
  analyzeJobMatch,
  JobMatchAnalysis,
  SAMPLE_JOB_DESCRIPTIONS,
  KeywordMatchItem,
} from '@/lib/jobMatcher';
import { jobDescriptionStorage } from '@/lib/storage';

interface JobMatcherProps {
  resumeData: ResumeData;
  onApplyKeyword?: (keyword: string, section: string) => void;
  onOpenKeywordGap?: () => void;
}

export default function JobMatcher({ resumeData, onApplyKeyword, onOpenKeywordGap }: JobMatcherProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing'>('all');
  const [selectedKeywordForInfo, setSelectedKeywordForInfo] = useState<KeywordMatchItem | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // Load persistent JD on mount
  useEffect(() => {
    const saved = jobDescriptionStorage.getLatest();
    if (saved && saved.rawText) {
      setJobDescription(saved.rawText);
      const res = analyzeJobMatch(resumeData, saved.rawText);
      setAnalysis(res);
    }
  }, [resumeData]);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    // 350ms deterministic UX transition
    setTimeout(() => {
      const res = analyzeJobMatch(resumeData, jobDescription);
      setAnalysis(res);
      jobDescriptionStorage.save({
        rawText: jobDescription,
        targetRole: res.targetRoleDetected,
      });
      setIsAnalyzing(false);
    }, 350);
  };

  const handleClear = () => {
    setJobDescription('');
    setAnalysis(null);
    setSelectedKeywordForInfo(null);
    jobDescriptionStorage.clear();
  };

  const handleSelectSample = (sampleText: string) => {
    setJobDescription(sampleText);
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeJobMatch(resumeData, sampleText);
      setAnalysis(res);
      jobDescriptionStorage.save({
        rawText: sampleText,
        targetRole: res.targetRoleDetected,
      });
      setIsAnalyzing(false);
    }, 350);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Target Job Description
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Paste the job posting to calculate a real, deterministic keyword match percentage.
            </p>
          </div>

          {/* Preset quick samples */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-gray-500">Quick Samples:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(s.text)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, tech stack, and responsibilities from any job posting (e.g. LinkedIn, Indeed, Greenhouse)..."
          rows={5}
          className="resize-y text-xs sm:text-sm font-mono border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 focus:bg-white dark:focus:bg-gray-900 transition-colors mb-4"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-semibold px-4"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Analyze Job Match
                </>
              )}
            </Button>

            {jobDescription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="rounded-xl text-xs text-slate-500 dark:text-gray-400 hover:text-rose-600"
              >
                Clear
              </Button>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-gray-500">
            {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words detected` : 'No job description loaded'}
          </span>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && analysis.totalJDKeywords > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Score Summary Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-gradient-to-br from-white to-slate-50/70 dark:from-gray-900 dark:to-gray-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Circular Score Gauge */}
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
                      strokeDashoffset={251.2 - (251.2 * analysis.matchScore) / 100}
                      strokeLinecap="round"
                      className={`transition-all duration-700 ${
                        analysis.matchScore >= 80
                          ? 'text-emerald-500'
                          : analysis.matchScore >= 60
                          ? 'text-indigo-600'
                          : 'text-amber-500'
                      }`}
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {analysis.matchScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Match
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Job Description Compatibility
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      analysis.matchScore >= 80
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                        : analysis.matchScore >= 60
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                      {analysis.matchScore >= 80 ? 'High Match' : analysis.matchScore >= 60 ? 'Moderate Match' : 'Keyword Gap'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Target Role Detected: <strong className="text-slate-800 dark:text-gray-200">{analysis.targetRoleDetected}</strong>
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> {analysis.matchedCount} Matched Keywords
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                      <AlertCircle className="w-4 h-4" /> {analysis.missingCount} Missing Keywords
                    </span>
                  </div>
                </div>
              </div>

              {onOpenKeywordGap && (
                <Button
                  onClick={onOpenKeywordGap}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold shrink-0"
                >
                  Open Keyword Gap Analyzer <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Keywords Breakdown Tabs */}
          <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Extracted Keyword Comparison
              </h4>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-gray-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({analysis.totalJDKeywords})
                </button>
                <button
                  onClick={() => setActiveTab('matched')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === 'matched'
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Matched ({analysis.matchedCount})
                </button>
                <button
                  onClick={() => setActiveTab('missing')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === 'missing'
                      ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Missing ({analysis.missingCount})
                </button>
              </div>
            </div>

            {/* Keyword Chips Grid */}
            <div className="pt-4 flex flex-wrap gap-2">
              {(activeTab === 'all'
                ? [...analysis.matchedKeywords, ...analysis.missingKeywords]
                : activeTab === 'matched'
                ? analysis.matchedKeywords
                : analysis.missingKeywords
              ).map((item) => {
                const isSelected = selectedKeywordForInfo?.keyword === item.keyword;
                return (
                  <button
                    key={item.keyword}
                    onClick={() => setSelectedKeywordForInfo(isSelected ? null : item)}
                    className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      item.foundInResume
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                        : item.isHighPriority
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:border-rose-400'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:border-amber-400'
                    } ${isSelected ? 'ring-2 ring-indigo-500 scale-105' : ''}`}
                  >
                    {item.foundInResume ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className={`w-3.5 h-3.5 ${item.isHighPriority ? 'text-rose-500' : 'text-amber-500'}`} />
                    )}
                    <span>{item.keyword}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 font-bold">
                      {item.frequencyInJD}x
                    </span>
                    {item.isHighPriority && !item.foundInResume && (
                      <span className="text-[9px] font-bold uppercase text-rose-600 dark:text-rose-400">
                        Priority
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clicked Keyword Suggestion Box */}
            <AnimatePresence>
              {selectedKeywordForInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {selectedKeywordForInfo.keyword}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold capitalize">
                          {selectedKeywordForInfo.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-gray-400">
                          Appears {selectedKeywordForInfo.frequencyInJD} time(s) in JD
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 mt-1.5">
                        {selectedKeywordForInfo.contextRecommendation?.suggestion}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(selectedKeywordForInfo.keyword)}
                      className="rounded-lg text-xs font-semibold h-8 bg-white dark:bg-gray-800 shrink-0"
                    >
                      {copiedKeyword === selectedKeywordForInfo.keyword ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copy Keyword
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Tailoring Recommendations for This Posting
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-gray-950/60 border border-slate-100 dark:border-gray-800 text-xs text-slate-700 dark:text-gray-300"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
