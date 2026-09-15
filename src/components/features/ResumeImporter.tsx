import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/types/resume';
import {
  extractTextFromFile,
  parseResumeText,
  ParsedResumeResult,
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
  const [parseResult, setParseResult] = useState<ParsedResumeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setParseResult(null);

    try {
      const extractedText = await extractTextFromFile(file);

      // If JSON, try direct parsing first
      if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(extractedText);
          const candidateData = json.resumeData || json;
          const fields = Object.keys(candidateData).filter(
            (k) => Boolean(candidateData[k]) && Array.isArray(candidateData[k]) ? candidateData[k].length > 0 : true
          );
          setParseResult({
            success: true,
            fileName: file.name,
            fileType: 'json',
            data: candidateData,
            extractedFields: fields,
            rawTextPreview: JSON.stringify(candidateData, null, 2).slice(0, 500),
          });
          setIsProcessing(false);
          return;
        } catch {
          // Fallback to text parser
        }
      }

      const parsed = parseResumeText(extractedText, file.name);
      if (!parsed.success) {
        setErrorMsg(parsed.errorMessage || 'Could not extract sufficient structured fields from this file.');
      } else {
        setParseResult(parsed);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error processing file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleConfirmApply = () => {
    if (!parseResult || !parseResult.data) return;
    onApplyImportedData(parseResult.data);
    setAppliedSuccessfully(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 1200);
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
              Browser-side document extraction. Your files are processed entirely locally and never uploaded to any remote server.
            </p>
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-gray-950/40"
        >
          <input
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
            Supported formats: PDF, DOCX, TXT, JSON, Markdown (Local browser parsing)
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Review Import Screen */}
      <AnimatePresence>
        {parseResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 bg-white dark:bg-gray-900 p-6 shadow-md space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Review Extracted Information
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  File: {parseResult.fileName}
                </h4>
                <p className="text-xs text-slate-500">
                  Carefully inspect extracted fields before applying to your active resume editor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParseResult(null)}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
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
                Successfully Extracted Fields ({parseResult.extractedFields.length}):
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

            {/* Structured Preview Grid */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-2">
                <span className="font-bold text-slate-700 dark:text-gray-300 block">Personal Details:</span>
                <div>Name: <strong>{parseResult.data.fullName || 'Not detected'}</strong></div>
                <div>Title: <strong>{parseResult.data.jobTitle || 'Not detected'}</strong></div>
                <div>Email: <strong>{parseResult.data.email || 'Not detected'}</strong></div>
                <div>Phone: <strong>{parseResult.data.phone || 'Not detected'}</strong></div>
                <div>LinkedIn: <strong>{parseResult.data.linkedin || 'Not detected'}</strong></div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-2">
                <span className="font-bold text-slate-700 dark:text-gray-300 block">Content Summary:</span>
                <div>Skills Count: <strong>{parseResult.data.skills?.length || 0} skills</strong></div>
                <div>Experiences: <strong>{parseResult.data.experiences?.length || 0} positions</strong></div>
                <div>Education: <strong>{parseResult.data.education?.length || 0} entries</strong></div>
                <div>Certifications: <strong>{parseResult.data.certifications?.length || 0} entries</strong></div>
              </div>
            </div>

            {/* Raw Text Preview */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-[11px] font-mono text-slate-600 dark:text-gray-400 max-h-36 overflow-y-auto">
              <div className="font-bold text-slate-400 mb-1">Raw Extracted Stream Sample:</div>
              <pre className="whitespace-pre-wrap">{parseResult.rawTextPreview}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
