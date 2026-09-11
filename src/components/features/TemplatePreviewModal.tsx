import React, { useState } from 'react';
import { TemplateDefinition } from '../templates/registry';
import { ResumeData } from '@/types/resume';
import { X, Check, ZoomIn, ZoomOut, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
  resumeData: ResumeData;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelect,
  resumeData,
}) => {
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen || !template) return null;

  const TemplateComponent = template.component;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 140));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoom(100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-5xl h-[92vh] max-h-[1000px] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 bg-gray-50/80 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {template.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-white">
                  {template.category}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> ATS Verified
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate max-w-md mt-0.5">
                {template.structureNote}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 60}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm disabled:opacity-40"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium tracking-wide px-2 text-gray-700 min-w-[42px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 140}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm disabled:opacity-40"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-sm"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Select Button */}
            <button
              onClick={() => {
                onSelect(template.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Use This Template</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-8 flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="shadow-xl rounded-sm overflow-hidden bg-white w-full max-w-[210mm] min-h-[297mm]"
          >
            <TemplateComponent data={resumeData} />
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Best for:</span>
            <span>{template.bestFor}</span>
          </div>
          <div className="text-gray-400">
            Real LaTeX / Overleaf Typesetting • 100% Text-Based • Recruiter Approved
          </div>
        </div>
      </div>
    </div>
  );
};
