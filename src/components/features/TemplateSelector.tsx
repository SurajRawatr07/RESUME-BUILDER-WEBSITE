import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, CheckCircle2, Filter } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { TemplateType } from '@/types/resume';
import { useTheme } from '@/context/ThemeContext';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  TemplateCategory,
} from '../templates/registry';
import { TemplateMiniPreview } from './TemplateMiniPreview';

interface TemplateSelectorProps {
  onClose: () => void;
}

export default function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('All');

  const filteredTemplates =
    activeCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border ${
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Select Resume Template
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Zero Data Loss
              </span>
            </div>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Choose from 9 role-vetted LaTeX layouts. Your resume data is automatically preserved.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div
          className={`px-6 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto shrink-0 ${
            isDark ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50/70 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 shrink-0">
            <Filter className="w-3 h-3" />
          </div>
          {TEMPLATE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Grid of 9 Templates */}
        <div className="p-6 overflow-y-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`group rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer flex flex-col ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-1 ring-indigo-500/30'
                    : isDark
                    ? 'border-gray-800 hover:border-gray-600 bg-gray-850'
                    : 'border-gray-200 hover:border-indigo-200 bg-white hover:shadow-sm'
                }`}
              >
                {/* Mini LaTeX Sheet Preview */}
                <div className="relative p-3 bg-gray-100 dark:bg-gray-950 flex justify-center items-center border-b border-gray-200 dark:border-gray-800">
                  <div className="w-full max-w-[190px]">
                    <TemplateMiniPreview template={template} />
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md z-10">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Extremely Simple Template Card (Requirement 7) */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3
                      className={`font-bold text-sm leading-snug ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {template.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Best for:</span> {template.bestFor}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-600 dark:text-gray-300 group-hover:text-indigo-600'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Use This Template'} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
