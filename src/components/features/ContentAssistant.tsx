import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  FileEdit,
  Zap,
  X,
  Info
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
  onApplyImprovement?: (newText: string, sectionType: string, entryIndex?: number) => void;
  onClose?: () => void;
}

type SectionChoice = 'summary' | 'experience' | 'project' | 'skills' | 'custom';

export default function ContentAssistant({
  resumeData,
  onApplyImprovement,
}: ContentAssistantProps) {
  const [selectedSection, setSelectedSection] = useState<SectionChoice>('summary');
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(0);
  const [inputText, setInputText] = useState<string>(resumeData.summary || '');
  const [selectedTool, setSelectedTool] = useState<AssistantToolType>('improve_summary');
  const [activeVerbCategory, setActiveVerbCategory] = useState<string>('Engineering');
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [draftText, setDraftText] = useState<string>('');
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);

  const handleSectionChange = (section: SectionChoice, entryIdx = 0) => {
    setSelectedSection(section);
    setSelectedEntryIndex(entryIdx);
    setResult(null);
    setDraftText('');
    setIsEditingDraft(false);
    setReplaceConfirmed(false);

    if (section === 'summary') {
      setInputText(resumeData.summary || '');
      setSelectedTool('improve_summary');
    } else if (section === 'experience') {
      const targetExp = resumeData.experiences?.[entryIdx];
      setInputText(targetExp?.description || '');
      setSelectedTool('rewrite_bullet');
    } else if (section === 'project') {
      const targetProj = resumeData.projects?.[entryIdx];
      setInputText(targetProj?.description || '');
      setSelectedTool('make_ats_friendly');
    } else if (section === 'skills') {
      const allSkills = [
        ...(resumeData.skills || []),
        ...(resumeData.technologies || []),
      ];
      setInputText(allSkills.join(', '));
      setSelectedTool('refine_skills');
    } else {
      setInputText('');
      setSelectedTool('make_professional');
    }
  };

  const handleRunTool = (tool: AssistantToolType, verbCat?: string) => {
    setSelectedTool(tool);
    setReplaceConfirmed(false);
    setIsEditingDraft(false);

    const cat = verbCat || activeVerbCategory;
    let res: TransformationResult;
    switch (tool) {
      case 'improve_summary':
        res = contentAssistant.improveSummary(inputText);
        break;
      case 'rewrite_bullet':
        res = contentAssistant.rewriteBullet(inputText);
        break;
      case 'refine_skills':
        res = contentAssistant.refineSkills(inputText);
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
        const verbs = STRONG_ACTION_VERBS[cat] || STRONG_ACTION_VERBS['Engineering'];
        const chosenVerb = verbs[0];
        const cleanBody = inputText.trim().replace(/^[-•*]\s*/, '').replace(/^[a-zA-Z]+\s+/, '');
        res = {
          tool: 'generate_verb',
          originalText: inputText,
          improvedText: cleanBody ? `${chosenVerb} ${cleanBody}` : chosenVerb,
          explanation: `Started with "${chosenVerb}" from ${cat} action verbs without altering your factual scope.`,
          highlights: [chosenVerb, cat],
        };
        break;
      }
      default:
        res = contentAssistant.improveSummary(inputText);
    }
    setResult(res);
    setDraftText(res.improvedText);
  };

  const handleCopy = () => {
    if (!draftText) return;
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptAndApply = () => {
    if (!result || !draftText.trim() || !onApplyImprovement) return;
    onApplyImprovement(draftText, selectedSection, selectedEntryIndex);
    setReplaceConfirmed(true);
    setIsEditingDraft(false);
    setTimeout(() => setReplaceConfirmed(false), 2500);
  };

  const handleReject = () => {
    setResult(null);
    setDraftText('');
    setIsEditingDraft(false);
    setReplaceConfirmed(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Resume Content Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Refines clarity, grammar, capitalization, and active phrasing strictly from your real text — never invents fake numbers or claims.
              </p>
            </div>
          </div>

          {/* Section selector tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-gray-800 rounded-xl text-xs font-semibold overflow-x-auto">
            {(
              [
                { id: 'summary', label: 'Summary' },
                { id: 'experience', label: 'Experience' },
                { id: 'project', label: 'Projects' },
                { id: 'skills', label: 'Skills' },
                { id: 'custom', label: 'Custom' },
              ] as const
            ).map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleSectionChange(sec.id, 0)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSection === sec.id
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-entry selector when editing Experience or Projects */}
        {selectedSection === 'experience' && resumeData.experiences && resumeData.experiences.length > 0 && (
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-gray-300">Experience Entry:</span>
            <select
              value={selectedEntryIndex}
              onChange={(e) => handleSectionChange('experience', Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              {resumeData.experiences.map((exp, idx) => (
                <option key={exp.id || idx} value={idx}>
                  {exp.jobTitle || 'Role'} {exp.company ? `@ ${exp.company}` : `#${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSection === 'project' && resumeData.projects && resumeData.projects.length > 0 && (
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-gray-300">Project Entry:</span>
            <select
              value={selectedEntryIndex}
              onChange={(e) => handleSectionChange('project', Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
            >
              {resumeData.projects.map((proj, idx) => (
                <option key={proj.id || idx} value={idx}>
                  {proj.title || `Project #${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
            Original Text to Refine:
          </label>
          <Textarea
            id="content-assistant-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder={
              selectedSection === 'skills'
                ? 'Comma-separated skills, e.g. react, typescript, nodejs, typescript...'
                : 'Type or paste the resume sentence or summary you wish to refine...'
            }
            className="text-xs sm:text-sm border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/50 focus:bg-white dark:focus:bg-gray-900"
          />
        </div>

        {/* Transformation Action Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
          <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
            Available Refinement Tools:
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
              <Zap className="w-3.5 h-3.5 mr-1" /> Strengthen Bullet
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'refine_skills' ? 'default' : 'outline'}
              onClick={() => handleRunTool('refine_skills')}
              className="rounded-xl text-xs h-8"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Refine Skills List
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
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Fix Grammar &amp; Casing
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
                  handleRunTool('generate_verb', cat);
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
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
            Select a category to lead with an action verb
          </span>
        </div>
      </div>

      {/* Result Comparison Card with Accept / Edit / Reject */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Suggested Refinement
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400">
                {result.explanation}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className="rounded-xl text-xs h-8"
              >
                <FileEdit className="w-3.5 h-3.5 mr-1" /> {isEditingDraft ? 'Done Editing' : 'Edit Draft'}
              </Button>

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

              <Button
                size="sm"
                variant="outline"
                onClick={handleReject}
                className="rounded-xl text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/40"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Reject
              </Button>

              {onApplyImprovement && selectedSection !== 'custom' && (
                <Button
                  id="content-assistant-accept-btn"
                  size="sm"
                  onClick={handleAcceptAndApply}
                  disabled={!draftText.trim()}
                  className="rounded-xl text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {replaceConfirmed ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Applied to Resume!
                    </>
                  ) : (
                    <>Accept &amp; Apply</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {result.guidanceNote && (
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{result.guidanceNote}</span>
            </div>
          )}

          {/* Side by side comparison */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">
                Original Content (Unchanged Until Accepted)
              </span>
              <p className="text-xs text-slate-600 dark:text-gray-400 whitespace-pre-wrap">
                {result.originalText || '(empty)'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Refined Draft</span>
                <span className="text-[10px] lowercase font-normal">no invented metrics</span>
              </span>
              {isEditingDraft ? (
                <Textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={4}
                  className="text-xs bg-white dark:bg-gray-900 border-emerald-300 dark:border-emerald-700"
                />
              ) : (
                <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium whitespace-pre-wrap">
                  {draftText || '(empty)'}
                </p>
              )}
            </div>
          </div>

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
