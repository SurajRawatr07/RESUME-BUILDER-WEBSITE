import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import { TemplateType } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Check, Eye, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  TemplateCategory,
  TemplateDefinition,
} from '../templates/registry';
import { TemplateMiniPreview } from './TemplateMiniPreview';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface TemplateGalleryProps {
  onSelectTemplate: () => void;
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const { setSelectedTemplate, selectedTemplate, resumeData } = useResumeStore();
  const { isDark } = useTheme();

  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateDefinition | null>(null);

  const filteredTemplates =
    activeCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onSelectTemplate();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Category</span>
          </div>
          {TEMPLATE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
          Showing {filteredTemplates.length} of 9 Templates
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, i) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <motion.div
                layout
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group rounded-xl overflow-hidden border transition-all duration-200 flex flex-col ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : isDark
                    ? 'border-gray-800 hover:border-gray-700 bg-gray-900 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Visual Mini Preview Container */}
                <div
                  className="relative p-4 bg-gray-50 dark:bg-gray-950 flex justify-center items-center cursor-pointer overflow-hidden border-b border-gray-200 dark:border-gray-800"
                  onClick={() => setPreviewingTemplate(template)}
                >
                  {/* Miniature Overleaf LaTeX preview */}
                  <div className="w-full max-w-[220px] shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <TemplateMiniPreview template={template} />
                  </div>

                  {/* Hover Overlay with Quick Preview */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewingTemplate(template);
                      }}
                      className="px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Selected Indicator Ribbon */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-xs z-10">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Extremely Simple Template Card (Requirement 7) */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3
                      className={`font-bold text-base leading-snug ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {template.name}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Best for:</span> {template.bestFor}
                    </p>
                  </div>

                  {/* Action Buttons: Preview and Use This Template */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewingTemplate(template)}
                      className={`text-xs h-9 rounded-lg font-medium ${
                        isDark
                          ? 'border-gray-800 hover:bg-gray-800 text-gray-300'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-gray-500" />
                      Preview
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleSelect(template.id)}
                      className={`text-xs h-9 rounded-lg font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-gray-900 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700'
                      }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      ) : (
                        'Use This Template'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Full Screen A4 Preview Modal */}
      <TemplatePreviewModal
        template={previewingTemplate}
        isOpen={!!previewingTemplate}
        onClose={() => setPreviewingTemplate(null)}
        onSelect={(templateId) => {
          setSelectedTemplate(templateId as TemplateType);
          onSelectTemplate();
        }}
        resumeData={resumeData}
      />
    </div>
  );
}
