import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import {
  analyzeJobMatch,
  JobMatchAnalysis,
  KeywordMatchItem,
} from '@/lib/jobMatcher';
import { jobDescriptionStorage } from '@/lib/storage';

interface KeywordGapAnalyzerProps {
  resumeData: ResumeData;
  onSelectKeywordToInsert?: (keyword: string, section: string) => void;
}

export default function KeywordGapAnalyzer({
  resumeData,
  onSelectKeywordToInsert,
}: KeywordGapAnalyzerProps) {
  const savedJD = jobDescriptionStorage.getLatest();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordMatchItem | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const rawJD = savedJD?.rawText || '';
  const analysis: JobMatchAnalysis = analyzeJobMatch(resumeData, rawJD);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const allKeywords = [...analysis.matchedKeywords, ...analysis.missingKeywords];

  const filteredKeywords = allKeywords.filter((k) => {
    const matchesSearch = k.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || k.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'languages', 'frameworks', 'tools', 'cloud', 'practices', 'concepts'];

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
              Deterministic comparison between current resume data and target role requirements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {analysis.matchedCount} Matched
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {analysis.highPriorityMissing.length} High Priority Missing
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {analysis.missingCount} Missing
            </span>
          </div>
        </div>

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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Keyword Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Click any keyword to view strategic contextual placement recommendations
        </h4>

        {filteredKeywords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-xs">
            No keywords found matching current filter.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredKeywords.map((item) => {
              const isSelected = selectedKeyword?.keyword === item.keyword;
              return (
                <button
                  key={item.keyword}
                  onClick={() => setSelectedKeyword(isSelected ? null : item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    item.foundInResume
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                      : item.isHighPriority
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:border-rose-400'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:border-amber-400'
                  } ${isSelected ? 'ring-2 ring-indigo-500 shadow-sm scale-105' : ''}`}
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
                      High Priority
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Keyword Detailed Natural Fit Suggestion */}
        <AnimatePresence>
          {selectedKeyword && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-5 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {selectedKeyword.keyword}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      selectedKeyword.foundInResume
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200'
                        : selectedKeyword.isHighPriority
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900 dark:text-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-200'
                    }`}>
                      {selectedKeyword.foundInResume ? 'Currently in Resume' : selectedKeyword.isHighPriority ? 'High Priority Gap' : 'Missing Skill'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                      Category: {selectedKeyword.category}
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

                    <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 text-xs font-mono text-slate-800 dark:text-gray-200 flex items-center justify-between gap-2">
                      <span>{selectedKeyword.keyword}</span>
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
      </div>
    </div>
  );
}
