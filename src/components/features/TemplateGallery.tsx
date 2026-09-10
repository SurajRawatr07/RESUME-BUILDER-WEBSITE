import { motion } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import { TemplateType } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Check } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: () => void;
}

const templates: {
  id: TemplateType;
  name: string;
  description: string;
  gradient: string;
  accentColor: string;
  bestFor: string;
  tag: string;
  tagColor: string;
  preview: { sidebar?: string; header?: string; lines: string[] };
}[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Two-column layout with an elegant indigo sidebar',
    gradient: 'from-indigo-500 to-indigo-700',
    accentColor: '#6366f1',
    bestFor: 'Corporate, IT, Management',
    tag: 'Popular',
    tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    preview: { sidebar: '#6366f1', lines: ['75%', '60%', '85%', '50%', '70%'] },
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Single-column, typography-first ATS design',
    gradient: 'from-gray-600 to-gray-900',
    accentColor: '#374151',
    bestFor: 'Freshers, Academics, Government',
    tag: 'ATS-Safe',
    tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    preview: { lines: ['80%', '55%', '90%', '65%', '45%'] },
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Stylish gradient header with teal accents',
    gradient: 'from-blue-500 to-teal-400',
    accentColor: '#0ea5e9',
    bestFor: 'Designers, Marketers, Content',
    tag: 'Creative',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    preview: { header: 'linear-gradient(135deg, #3b82f6, #14b8a6)', lines: ['70%', '85%', '60%', '75%'] },
  },
  {
    id: 'corporate',
    name: 'Corporate Elite',
    description: 'Dark header with gold accents — executive presence',
    gradient: 'from-slate-700 to-amber-600',
    accentColor: '#f59e0b',
    bestFor: 'Executives, C-Suite, Directors',
    tag: 'Executive',
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    preview: { header: 'linear-gradient(135deg, #0f172a, #1e293b)', lines: ['80%', '65%', '90%', '55%'] },
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    description: 'UI-focused with project card highlights',
    gradient: 'from-indigo-600 to-blue-500',
    accentColor: '#4f46e5',
    bestFor: 'Frontend Devs, UI Engineers',
    tag: 'Tech',
    tagColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    preview: { header: 'linear-gradient(135deg, #4f46e5, #3b82f6)', lines: ['75%', '88%', '62%', '80%'] },
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    description: 'Architecture-focused, structured, text-heavy',
    gradient: 'from-gray-700 to-gray-900',
    accentColor: '#1f2937',
    bestFor: 'Backend Devs, API Engineers',
    tag: 'Tech',
    tagColor: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    preview: { sidebar: '#1f2937', lines: ['70%', '85%', '60%', '75%', '55%'] },
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Balanced corporate layout, dark header',
    gradient: 'from-slate-700 to-slate-900',
    accentColor: '#334155',
    bestFor: 'SDE Roles, Tech Companies',
    tag: 'Versatile',
    tagColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    preview: { header: 'linear-gradient(135deg, #1e293b, #334155)', lines: ['80%', '68%', '90%', '60%'] },
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    description: 'Dual-stack skills with project showcase',
    gradient: 'from-blue-600 to-teal-500',
    accentColor: '#2563eb',
    bestFor: 'Full Stack, MERN/MEAN Stack',
    tag: 'Full Stack',
    tagColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    preview: { header: 'linear-gradient(135deg, #2563eb, #0d9488)', lines: ['75%', '85%', '65%', '78%'] },
  },
];

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const { setSelectedTemplate, selectedTemplate } = useResumeStore();
  const { isDark } = useTheme();

  const handleSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onSelectTemplate();
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {templates.map((template, i) => {
        const isSelected = selectedTemplate === template.id;
        return (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: 'easeOut' }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => handleSelect(template.id)}
            className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col
              ${isSelected
                ? 'border-indigo-500 shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-900/40'
                : isDark
                  ? 'border-gray-700/60 hover:border-gray-500 shadow-lg hover:shadow-xl'
                  : 'border-gray-200 hover:border-indigo-300 shadow-md hover:shadow-xl'
              }
              ${isDark ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            {/* Template Preview Mockup */}
            <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-900">

              {/* Resume Mockup */}
              <div className="absolute inset-3 rounded-lg overflow-hidden shadow-lg" style={{ background: 'white' }}>
                {/* Header bar or sidebar */}
                {template.preview.header ? (
                  <div style={{ background: template.preview.header, height: '36px', width: '100%' }}>
                    <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.9)', height: '6px', borderRadius: '3px', width: '55%', marginBottom: '4px' }} />
                      <div style={{ background: 'rgba(255,255,255,0.5)', height: '4px', borderRadius: '3px', width: '35%' }} />
                    </div>
                  </div>
                ) : template.preview.sidebar ? (
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ background: template.preview.sidebar, width: '35%', padding: '8px 6px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.9)', height: '5px', borderRadius: '2px', marginBottom: '4px', width: '80%' }} />
                      <div style={{ background: 'rgba(255,255,255,0.5)', height: '3px', borderRadius: '2px', marginBottom: '8px', width: '60%' }} />
                      {[1, 0.7, 0.9, 0.6].map((w, j) => (
                        <div key={j} style={{ background: 'rgba(255,255,255,0.35)', height: '3px', borderRadius: '2px', marginBottom: '3px', width: `${w * 90}%` }} />
                      ))}
                    </div>
                    <div style={{ flex: 1, padding: '8px 8px' }}>
                      {template.preview.lines.map((w, j) => (
                        <div key={j} style={{ background: j === 0 ? '#e5e7eb' : '#f3f4f6', height: j === 0 ? '5px' : '3px', borderRadius: '2px', marginBottom: '4px', width: w }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '10px 10px' }}>
                    <div style={{ height: '6px', background: '#1f2937', borderRadius: '3px', width: '60%', marginBottom: '4px' }} />
                    <div style={{ height: '3px', background: '#9ca3af', borderRadius: '2px', width: '40%', marginBottom: '10px' }} />
                    {template.preview.lines.map((w, j) => (
                      <div key={j} style={{ background: j % 2 === 0 ? '#e5e7eb' : '#f3f4f6', height: j === 0 ? '4px' : '3px', borderRadius: '2px', marginBottom: '4px', width: w }} />
                    ))}
                  </div>
                )}

                {/* After header: content lines when header layout */}
                {template.preview.header && (
                  <div style={{ padding: '8px 10px' }}>
                    {template.preview.lines.map((w, j) => (
                      <div key={j} style={{ background: j === 0 ? '#e5e7eb' : '#f3f4f6', height: j === 0 ? '4px' : '3px', borderRadius: '2px', marginBottom: '4px', width: w }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-10 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Selected badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Tag badge */}
              <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 ${template.tagColor}`}>
                {template.tag}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {template.name}
              </h3>
              <p className={`text-xs mb-2 leading-relaxed flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {template.description}
              </p>
              <p className={`text-[10px] font-medium mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Best for: {template.bestFor}
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={e => { e.stopPropagation(); handleSelect(template.id); }}
                  className={`w-full text-xs h-8 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                      : isDark
                        ? 'bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white border border-gray-600 hover:border-indigo-500'
                        : 'bg-gray-900 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    'Use Template'
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
