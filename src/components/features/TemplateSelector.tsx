import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/stores/resumeStore';
import { TemplateType } from '@/types/resume';
import { useTheme } from '@/context/ThemeContext';

interface TemplateSelectorProps {
  onClose: () => void;
}

const templates: { id: TemplateType; name: string; description: string; color: string; tag: string }[] = [
  { id: 'modern', name: 'Modern Professional', description: 'Clean two-column with indigo sidebar', color: 'from-indigo-500 to-indigo-700', tag: 'Popular' },
  { id: 'minimal', name: 'Minimal Clean', description: 'Single-column, strong typography', color: 'from-gray-600 to-gray-900', tag: 'ATS-Safe' },
  { id: 'creative', name: 'Creative Designer', description: 'Gradient header with teal accents', color: 'from-blue-500 to-teal-500', tag: 'Creative' },
  { id: 'corporate', name: 'Corporate Elite', description: 'Dark header with gold accents', color: 'from-slate-700 to-amber-600', tag: 'Executive' },
  { id: 'frontend', name: 'Frontend Developer', description: 'UI-focused project highlights', color: 'from-indigo-600 to-blue-500', tag: 'Tech' },
  { id: 'backend', name: 'Backend Developer', description: 'Logic-focused architecture layout', color: 'from-gray-700 to-gray-900', tag: 'Tech' },
  { id: 'software-engineer', name: 'Software Engineer', description: 'Balanced corporate dark header', color: 'from-slate-700 to-slate-900', tag: 'Versatile' },
  { id: 'fullstack', name: 'Full Stack Developer', description: 'Dual-stack project-centric', color: 'from-blue-600 to-teal-600', tag: 'Full Stack' },
];

export default function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();
  const { isDark } = useTheme();

  const handleSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className={`rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        {/* Header */}
        <div className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between backdrop-blur-xl ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-100'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Choose Template</h2>
            <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your data is preserved when switching</p>
          </div>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, i) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handleSelect(template.id)}
                className={`
                  text-left rounded-2xl overflow-hidden border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30'
                    : isDark
                      ? 'border-gray-700 hover:border-gray-500'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                `}
              >
                {/* Preview */}
                <div className={`h-28 bg-gradient-to-br ${template.color} relative overflow-hidden`}>
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-bold text-white/90 bg-black/20 px-2 py-0.5 rounded-full">{template.tag}</span>
                  </div>
                  <div className="absolute inset-3 opacity-15 space-y-1.5">
                    <div className="h-3 bg-white rounded w-2/3" />
                    <div className="h-2 bg-white/70 rounded w-1/2" />
                    <div className="space-y-1 mt-2">
                      {[1, 0.8, 0.7].map((w, j) => (
                        <div key={j} className="h-1.5 bg-white/40 rounded" style={{ width: `${w * 100}%` }} />
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{template.name}</h3>
                    {isSelected && <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Active</span>}
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{template.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

