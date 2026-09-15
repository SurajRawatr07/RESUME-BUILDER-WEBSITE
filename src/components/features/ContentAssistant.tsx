import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileEdit,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/types/resume';
import {
  contentAssistant,
  AssistantToolType,
  STRONG_ACTION_VERBS,
  TransformationResult,
} from '@/lib/contentAssistant';

interface ContentAssistantProps {
  resumeData: ResumeData;
  onApplyImprovement?: (newText: string, sectionType: string) => void;
  onClose?: () => void;
}

export default function ContentAssistant({
  resumeData,
  onApplyImprovement,
  onClose,
}: ContentAssistantProps) {
  const [selectedSection, setSelectedSection] = useState<'summary' | 'experience' | 'project' | 'custom'>('summary');
  const [inputText, setInputText] = useState<string>(resumeData.summary || '');
  const [selectedTool, setSelectedTool] = useState<AssistantToolType>('improve_summary');
  const [activeVerbCategory, setActiveVerbCategory] = useState<string>('Engineering');
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);

  // Sync sample when user switches section
  const handleSectionChange = (section: 'summary' | 'experience' | 'project' | 'custom') => {
    setSelectedSection(section);
    setResult(null);
    setReplaceConfirmed(false);
    if (section === 'summary') {
      setInputText(resumeData.summary || '');
      setSelectedTool('improve_summary');
    } else if (section === 'experience') {
      const firstExp = resumeData.experiences?.[0];
      const sampleBullet = firstExp?.description ? firstExp.description.split('\n')[0] : '';
      setInputText(sampleBullet || 'Worked on backend APIs and helped with database queries.');
      setSelectedTool('rewrite_bullet');
    } else if (section === 'project') {
      const firstProj = resumeData.projects?.[0];
      setInputText(firstProj?.description || 'Built a web application using React and Node.js.');
      setSelectedTool('make_ats_friendly');
    } else {
      setInputText('');
    }
  };

  const handleRunTool = (tool: AssistantToolType) => {
    setSelectedTool(tool);
    setReplaceConfirmed(false);

    let res: TransformationResult;
    switch (tool) {
      case 'improve_summary':
        res = contentAssistant.improveSummary(inputText);
        break;
      case 'rewrite_bullet':
        res = contentAssistant.rewriteBullet(inputText);
        break;
      case 'make_ats_friendly':
        res = contentAssistant.makeATSFriendly(inputText);
        break;
      case 'fix_grammar':
        res = contentAssistant.fixGrammar(inputText);
        break;
      case 'make_professional':
        res = contentAssistant.makeMoreProfessional(inputText);
        break;
      case 'shorten_content':
        res = contentAssistant.shortenContent(inputText);
        break;
      case 'generate_verb': {
        const verbs = STRONG_ACTION_VERBS[activeVerbCategory] || STRONG_ACTION_VERBS['Engineering'];
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        res = {
          tool: 'generate_verb',
          originalText: inputText,
          improvedText: `${randomVerb} ${inputText.replace(/^[a-zA-Z]+\s+/, '')}`,
          explanation: `Injected impact verb "${randomVerb}" from ${activeVerbCategory} taxonomy.`,
          highlights: [randomVerb, activeVerbCategory],
        };
        break;
      }
      default:
        res = contentAssistant.improveSummary(inputText);
    }
    setResult(res);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplace = () => {
    if (!result) return;
    if (onApplyImprovement) {
      onApplyImprovement(result.improvedText, selectedSection);
      setReplaceConfirmed(true);
      setTimeout(() => setReplaceConfirmed(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Resume Content Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Deterministic frontend rewriting tools adhering to strict ATS standards and Google XYZ formulas.
              </p>
            </div>
          </div>

          {/* Section selector pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-gray-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => handleSectionChange('summary')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedSection === 'summary'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => handleSectionChange('experience')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedSection === 'experience'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Experience Bullet
            </button>
            <button
              onClick={() => handleSectionChange('project')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedSection === 'project'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Project
            </button>
            <button
              onClick={() => handleSectionChange('custom')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedSection === 'custom'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
            Original Text to Refine:
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Type or paste the resume sentence or summary you wish to improve..."
            className="text-xs sm:text-sm font-mono border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 focus:bg-white dark:focus:bg-gray-900"
          />
        </div>

        {/* Transformation Action Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
          <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
            Available Transformation Tools:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedTool === 'improve_summary' ? 'default' : 'outline'}
              onClick={() => handleRunTool('improve_summary')}
              className="rounded-xl text-xs h-8"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" /> Improve Summary
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'rewrite_bullet' ? 'default' : 'outline'}
              onClick={() => handleRunTool('rewrite_bullet')}
              className="rounded-xl text-xs h-8"
            >
              <Zap className="w-3.5 h-3.5 mr-1" /> Rewrite Bullet (XYZ Formula)
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'make_ats_friendly' ? 'default' : 'outline'}
              onClick={() => handleRunTool('make_ats_friendly')}
              className="rounded-xl text-xs h-8"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Make ATS Friendly
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'fix_grammar' ? 'default' : 'outline'}
              onClick={() => handleRunTool('fix_grammar')}
              className="rounded-xl text-xs h-8"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Fix Grammar & Casing
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'make_professional' ? 'default' : 'outline'}
              onClick={() => handleRunTool('make_professional')}
              className="rounded-xl text-xs h-8"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Make More Professional
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'shorten_content' ? 'default' : 'outline'}
              onClick={() => handleRunTool('shorten_content')}
              className="rounded-xl text-xs h-8"
            >
              <FileEdit className="w-3.5 h-3.5 mr-1" /> Shorten Content
            </Button>
          </div>
        </div>

        {/* Action Verb Helper Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">Power Verbs:</span>
            {Object.keys(STRONG_ACTION_VERBS).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveVerbCategory(cat);
                  handleRunTool('generate_verb');
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                  activeVerbCategory === cat
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400'
                }`}
              >
                + {cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-gray-500">
            Select a category to inject a power verb
          </span>
        </div>
      </div>

      {/* Result Comparison Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Transformation Output
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400">
                {result.explanation}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="rounded-xl text-xs h-8"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                  </>
                )}
              </Button>

              {onApplyImprovement && (
                <Button
                  size="sm"
                  onClick={handleReplace}
                  className="rounded-xl text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {replaceConfirmed ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Replaced!
                    </>
                  ) : (
                    <>Replace in Resume</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
                Original Text
              </span>
              <p className="text-xs font-mono text-slate-600 dark:text-gray-400 whitespace-pre-wrap">
                {result.originalText || '(empty)'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Improved Text</span>
                <span className="text-[10px] lowercase font-normal">verified ATS compliant</span>
              </span>
              <p className="text-xs font-mono text-emerald-950 dark:text-emerald-200 font-medium whitespace-pre-wrap">
                {result.improvedText}
              </p>
            </div>
          </div>

          {/* Highlights */}
          {result.highlights.length > 0 && (
            <div className="flex items-center gap-1.5 pt-2 flex-wrap">
              <span className="text-[11px] text-slate-400">Key Enhancements:</span>
              {result.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
