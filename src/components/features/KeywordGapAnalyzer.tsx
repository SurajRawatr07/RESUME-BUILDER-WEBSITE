import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Lightbulb,
  Plus,
  Info,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import {
  analyzeJobMatch,
  JobMatchAnalysis,
  KeywordMatchItem,
  KeywordGroup,
} from '@/lib/jobMatcher';
import { jobDescriptionStorage } from '@/lib/storage';

interface KeywordGapAnalyzerProps {
  resumeData: ResumeData;
  onSelectKeywordToInsert?: (keyword: string, section: string) => void;
  onOpenJobMatcher?: () => void;
}

export default function KeywordGapAnalyzer({
  resumeData,
  onSelectKeywordToInsert,
  onOpenJobMatcher,
}: KeywordGapAnalyzerProps) {
  const savedJD = jobDescriptionStorage.getLatest();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<'all' | KeywordGroup>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordMatchItem | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [confirmingKeyword, setConfirmingKeyword] = useState<string | null>(null);
  const [insertedKeywords, setInsertedKeywords] = useState<Record<string, boolean>>({});

  const rawJD = savedJD?.rawText || '';
  const analysis: JobMatchAnalysis = analyzeJobMatch(resumeData, rawJD);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleConfirmInsert = (keyword: string, section: string) => {
    if (!onSelectKeywordToInsert) return;
    onSelectKeywordToInsert(keyword, section);
    setInsertedKeywords((prev) => ({ ...prev, [keyword]: true }));
    setConfirmingKeyword(null);
  };

  const allKeywords = [
    ...analysis.matchedKeywords,
    ...analysis.partialKeywords,
    ...analysis.missingKeywords,
  ];

  const filteredKeywords = allKeywords.filter((k) => {
    const matchesSearch = k.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesGroup = activeGroup === 'all' || k.group === activeGroup;
    return matchesSearch && matchesGroup;
  });

  const groupTabs: Array<{ id: 'all' | KeywordGroup; label: string }> = [
    { id: 'all', label: `All (${allKeywords.length})` },
    ...(analysis.groupBreakdowns || []).map((g) => ({
      id: g.group,
      label: `${g.label} (${g.exact + g.partial}/${g.total})`,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Keyword Gap Analyzer
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Side-by-side comparison of extracted resume terms vs target job requirements across Skills, Technical Terms, Tools &amp; Experience.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {analysis.matchedCount} Exact
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {analysis.partialCount} Partial
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {analysis.missingCount} Missing
            </span>
          </div>
        </div>

        {/* Category Breakdown Metrics Strip */}
        {analysis.isValidJD && analysis.groupBreakdowns && (
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {analysis.groupBreakdowns.map((gb) => (
              <button
                key={gb.group}
                type="button"
                onClick={() => setActiveGroup(gb.group)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeGroup === gb.group
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-gray-800 bg-slate-50/60 dark:bg-gray-950/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                  <span>{gb.label}</span>
                  <span className={gb.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}>
                    {gb.percentage}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  {gb.exact} exact · {gb.partial} partial · {gb.missing} missing
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter keywords..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {groupTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGroup(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeGroup === tab.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty JD Notice */}
      {!analysis.isValidJD && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">No Active Target Job Description Found</strong>
              <span className="mt-0.5 block">
                {analysis.validationError || 'Paste a job posting in JD Matcher first to inspect exact vs missing keyword gaps.'}
              </span>
            </div>
          </div>
          {onOpenJobMatcher && (
            <Button
              size="sm"
              onClick={onOpenJobMatcher}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs shrink-0"
            >
              Open JD Matcher <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      )}

      {/* Interactive Keyword Matrix */}
      {analysis.isValidJD && (
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Click any keyword to inspect placement advice or confirm adding it to your Skills
          </h4>

          {filteredKeywords.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-xs">
              No keywords found matching current filter.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredKeywords.map((item) => {
                const isSelected = selectedKeyword?.keyword === item.keyword;
                const badgeStyle =
                  item.matchStatus === 'exact'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                    : item.matchStatus === 'partial'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 hover:border-indigo-400'
                    : item.isHighPriority
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:border-rose-400'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:border-amber-400';

                return (
                  <button
                    key={item.keyword}
                    onClick={() => {
                      setSelectedKeyword(isSelected ? null : item);
                      setConfirmingKeyword(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${badgeStyle} ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-sm scale-105' : ''
                    }`}
                  >
                    {item.matchStatus === 'exact' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : item.matchStatus === 'partial' ? (
                      <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <AlertCircle className={`w-3.5 h-3.5 ${item.isHighPriority ? 'text-rose-500' : 'text-amber-500'}`} />
                    )}
                    <span>{item.keyword}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 font-bold">
                      {item.frequencyInJD}x
                    </span>
                    {item.matchStatus === 'partial' && (
                      <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-300">
                        Partial
                      </span>
                    )}
                    {item.isHighPriority && item.matchStatus === 'missing' && (
                      <span className="text-[9px] font-bold uppercase text-rose-600 dark:text-rose-400">
                        High Priority
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Keyword Detailed Placement & User-Confirmed Add Action */}
          <AnimatePresence>
            {selectedKeyword && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-5 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {selectedKeyword.keyword}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        selectedKeyword.matchStatus === 'exact'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200'
                          : selectedKeyword.matchStatus === 'partial'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200'
                          : selectedKeyword.isHighPriority
                          ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {selectedKeyword.matchStatus === 'exact'
                          ? 'Matched in Resume'
                          : selectedKeyword.matchStatus === 'partial'
                          ? 'Partially Matched'
                          : selectedKeyword.isHighPriority
                          ? 'High Priority Gap'
                          : 'Missing Skill'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                        Group: {selectedKeyword.group.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-gray-300">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-slate-900 dark:text-white">
                            Recommended Fit in Section: {selectedKeyword.contextRecommendation?.section}
                          </strong>
                          <p className="mt-0.5 text-slate-600 dark:text-gray-300">
                            {selectedKeyword.contextRecommendation?.suggestion}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 text-xs text-slate-800 dark:text-gray-200 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{selectedKeyword.keyword}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {onSelectKeywordToInsert && selectedKeyword.matchStatus !== 'exact' && (
                            insertedKeywords[selectedKeyword.keyword] ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                                <Check className="w-3.5 h-3.5" /> Added to Skills
                              </span>
                            ) : confirmingKeyword === selectedKeyword.keyword ? (
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmInsert(selectedKeyword.keyword, 'skills')}
                                  className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                  Confirm Add to Resume
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmingKeyword(null)}
                                  className="h-7 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setConfirmingKeyword(selectedKeyword.keyword)}
                                className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add to Skills
                              </Button>
                            )
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(selectedKeyword.keyword)}
                            className="h-7 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-gray-800"
                          >
                            {copiedText === selectedKeyword.keyword ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 dark:text-gray-400 block">
                      JD Frequency
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedKeyword.frequencyInJD}x
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extracted Resume Keywords Snapshot */}
          {analysis.resumeExtractedKeywords.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
                Keywords Currently Detected in Your Resume ({analysis.resumeExtractedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.resumeExtractedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
