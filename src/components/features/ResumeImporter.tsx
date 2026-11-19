import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import {
  extractTextFromFile,
  parseResumeText,
  ParsedResumeResult,
  ALLOWED_EXTENSIONS,
  MAX_IMPORT_FILE_SIZE_BYTES,
} from '@/lib/resumeParser';

interface ResumeImporterProps {
  onApplyImportedData: (data: Partial<ResumeData>) => void;
  onClose?: () => void;
}

export default function ResumeImporter({
  onApplyImportedData,
  onClose,
}: ResumeImporterProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<ParsedResumeResult | null>(null);
  const [editableData, setEditableData] = useState<Partial<ResumeData> | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeEditable = (parsed: ParsedResumeResult) => {
    setParseResult(parsed);
    setEditableData({
      fullName: parsed.data.fullName || '',
      jobTitle: parsed.data.jobTitle || '',
      email: parsed.data.email || '',
      phone: parsed.data.phone || '',
      location: parsed.data.location || '',
      linkedin: parsed.data.linkedin || '',
      github: parsed.data.github || '',
      portfolio: parsed.data.portfolio || '',
      summary: parsed.data.summary || '',
      aboutMe: parsed.data.aboutMe || parsed.data.summary || '',
      skills: parsed.data.skills || [],
      technologies: parsed.data.technologies || parsed.data.skills || [],
      experiences: parsed.data.experiences || [],
      projects: parsed.data.projects || [],
      education: parsed.data.education || [],
      certifications: parsed.data.certifications || [],
      achievements: parsed.data.achievements || [],
    });
    setSkillsInput((parsed.data.skills || []).join(', '));
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setParseResult(null);
    setEditableData(null);
    setAppliedSuccessfully(false);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      setErrorMsg(`Unsupported file format ".${ext || 'unknown'}". Please upload a PDF, DOCX, TXT, JSON, or MD file.`);
      setIsProcessing(false);
      return;
    }

    if (file.size === 0) {
      setErrorMsg('The uploaded file is empty (0 bytes). Your existing resume was left untouched.');
      setIsProcessing(false);
      return;
    }

    if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
      setErrorMsg('File exceeds the 10 MB browser limit. Your existing resume was left untouched.');
      setIsProcessing(false);
      return;
    }

    try {
      const extractedText = await extractTextFromFile(file);

      if (ext === 'json') {
        let json: Record<string, unknown>;
        try {
          json = JSON.parse(extractedText);
        } catch {
          setErrorMsg('Invalid or corrupted JSON file. Could not parse structured resume fields.');
          setIsProcessing(false);
          return;
        }

        const candidateData = (json.resumeData || json) as Partial<ResumeData>;
        if (!candidateData || typeof candidateData !== 'object' || Array.isArray(candidateData)) {
          setErrorMsg('JSON file does not contain a valid resume object.');
          setIsProcessing(false);
          return;
        }

        const fields = Object.keys(candidateData).filter((k) => {
          const val = (candidateData as Record<string, unknown>)[k];
          if (Array.isArray(val)) return val.length > 0;
          return typeof val === 'string' ? val.trim().length > 0 : Boolean(val);
        });

        if (fields.length === 0) {
          setErrorMsg('The JSON file contains no non-empty resume fields.');
          setIsProcessing(false);
          return;
        }

        initializeEditable({
          success: true,
          fileName: file.name,
          fileType: 'json',
          data: candidateData,
          extractedFields: fields,
          rawTextPreview: JSON.stringify(candidateData, null, 2).slice(0, 700),
        });
        setIsProcessing(false);
        return;
      }

      const parsed = parseResumeText(extractedText, file.name);
      if (!parsed.success) {
        setErrorMsg(
          parsed.errorMessage ||
            'Could not extract structured resume fields from this file. Your existing resume was left untouched.'
        );
      } else {
        initializeEditable(parsed);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(
        error.message ||
          'Failed to read or parse this file. Your existing resume was left untouched.'
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleConfirmApply = () => {
    if (!editableData) return;
    const cleanedSkills = skillsInput
      .split(/[,|\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const finalPayload: Partial<ResumeData> = {
      ...editableData,
      aboutMe: editableData.summary || editableData.aboutMe || '',
      skills: cleanedSkills,
      technologies: cleanedSkills,
    };

    onApplyImportedData(finalPayload);
    setAppliedSuccessfully(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 900);
  };

  const handleDiscard = () => {
    setParseResult(null);
    setEditableData(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" /> Import Existing Resume
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              100% browser-side extraction via PDF.js and Mammoth. Review and edit every extracted field before applying.
            </p>
          </div>
        </div>

        <div
          id="resume-import-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-gray-950/40'
          }`}
        >
          <input
            id="resume-import-file-input"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.json,.md"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            {isProcessing ? (
              <RotateCcw className="w-6 h-6 animate-spin" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200">
            {isProcessing ? 'Extracting readable text streams...' : 'Click to select or drag & drop your resume file'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supported formats: PDF, DOCX, TXT, JSON, Markdown (Max 10 MB · Local browser parsing)
          </p>
        </div>

        {errorMsg && (
          <div
            id="resume-import-error"
            className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Editable Review Import Screen */}
      <AnimatePresence>
        {parseResult && editableData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-gray-900 p-6 shadow-md space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Editable Import Preview
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  File: {parseResult.fileName}
                </h4>
                <p className="text-xs text-slate-500">
                  Inspect or adjust extracted details below before replacing your active resume data.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscard}
                  className="rounded-xl text-xs h-9"
                >
                  Discard
                </Button>
                <Button
                  id="resume-import-apply-btn"
                  size="sm"
                  onClick={handleConfirmApply}
                  disabled={appliedSuccessfully}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-9 shadow-sm"
                >
                  {appliedSuccessfully ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-emerald-300" /> Applied Successfully!
                    </>
                  ) : (
                    <>Apply to Current Resume</>
                  )}
                </Button>
              </div>
            </div>

            {/* Extracted Fields Badges */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Detected Sections ({parseResult.extractedFields.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {parseResult.extractedFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Editable Personal & Links Fields */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {(
                [
                  { key: 'fullName', label: 'Full Name' },
                  { key: 'jobTitle', label: 'Job Title' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'location', label: 'Location' },
                  { key: 'linkedin', label: 'LinkedIn' },
                  { key: 'github', label: 'GitHub' },
                  { key: 'portfolio', label: 'Portfolio / Website' },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label className="block font-semibold text-slate-600 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={(editableData[key] as string) || ''}
                    onChange={(e) =>
                      setEditableData((prev) => ({ ...(prev || {}), [key]: e.target.value }))
                    }
                    placeholder="Not detected"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            {/* Editable Summary */}
            <div className="text-xs space-y-1">
              <label className="block font-semibold text-slate-600 dark:text-gray-300">
                Professional Summary
              </label>
              <textarea
                rows={3}
                value={editableData.summary || ''}
                onChange={(e) =>
                  setEditableData((prev) => ({ ...(prev || {}), summary: e.target.value }))
                }
                placeholder="No summary extracted"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white"
              />
            </div>

            {/* Editable Skills */}
            <div className="text-xs space-y-1">
              <label className="block font-semibold text-slate-600 dark:text-gray-300">
                Extracted Skills (Comma-Separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, TypeScript, Node.js..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white"
              />
            </div>

            {/* Parsed Experience / Projects / Education Summary with optional delete */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-2">
                <span className="font-bold text-slate-700 dark:text-gray-300 block">
                  Experience ({editableData.experiences?.length || 0})
                </span>
                {(editableData.experiences || []).length === 0 ? (
                  <p className="text-slate-400">None detected</p>
                ) : (
                  (editableData.experiences || []).map((exp, idx) => (
                    <div key={exp.id || idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{exp.jobTitle || 'Role'}</div>
                        <div className="text-[11px] text-slate-500 truncate">{exp.company} {exp.startDate ? `· ${exp.startDate}` : ''}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditableData((prev) => ({
                            ...(prev || {}),
                            experiences: (prev?.experiences || []).filter((_, i) => i !== idx),
                          }))
                        }
                        className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                        title="Remove entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-2">
                <span className="font-bold text-slate-700 dark:text-gray-300 block">
                  Education ({editableData.education?.length || 0}) &amp; Projects ({editableData.projects?.length || 0})
                </span>
                {(editableData.education || []).map((edu, idx) => (
                  <div key={edu.id || idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{edu.degree || 'Degree'}</div>
                      <div className="text-[11px] text-slate-500 truncate">{edu.institution} {edu.graduationDate ? `· ${edu.graduationDate}` : ''}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditableData((prev) => ({
                          ...(prev || {}),
                          education: (prev?.education || []).filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(editableData.projects || []).map((proj, idx) => (
                  <div key={proj.id || idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">Project: {proj.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{proj.technologies || proj.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditableData((prev) => ({
                          ...(prev || {}),
                          projects: (prev?.projects || []).filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Text Preview */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-[11px] text-slate-600 dark:text-gray-400 max-h-32 overflow-y-auto">
              <div className="font-bold text-slate-400 mb-1">Extracted Raw Text Sample:</div>
              <pre className="whitespace-pre-wrap font-sans">{parseResult.rawTextPreview}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
