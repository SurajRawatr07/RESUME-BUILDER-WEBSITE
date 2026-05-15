import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Folder, Award, Plus, GripVertical } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import AdditionalSectionsForm from './forms/AdditionalSectionsForm';
import DragDropEditor, { Section } from '@/components/builder/DragDropEditor';

type SectionId = 'personal' | 'experience' | 'education' | 'projects' | 'skills' | 'additional';

const defaultSections: { id: SectionId; label: string; icon: string; required?: boolean }[] = [
  { id: 'personal', label: 'Personal Info', icon: '👤', required: true },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'skills', label: 'Skills & Technologies', icon: '⚡' },
  { id: 'additional', label: 'Additional Sections', icon: '➕' },
];

const formMap: Record<SectionId, JSX.Element> = {
  personal: <PersonalInfoForm />,
  experience: <ExperienceForm />,
  education: <EducationForm />,
  projects: <ProjectsForm />,
  skills: <SkillsForm />,
  additional: <AdditionalSectionsForm />,
};

export default function ResumeForm() {
  const { isDark } = useTheme();
  const [sections, setSections] = useState(defaultSections);
  const [useDragMode, setUseDragMode] = useState(false);

  // Build DragDropEditor sections from our simple section list
  const dragSections: Section[] = sections.map(s => ({
    id: s.id,
    label: s.label,
    icon: s.icon,
    required: s.required,
    content: formMap[s.id],
  }));

  if (useDragMode) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Drag to reorder sections
          </span>
          <button
            onClick={() => setUseDragMode(false)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-indigo-400 hover:bg-gray-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            Tab View
          </button>
        </div>

        {/* Drag & Drop sections */}
        <div className="flex-1 overflow-y-auto p-4">
          <DragDropEditor
            sections={dragSections}
            onReorder={(reordered) => {
              setSections(reordered.map(s => ({
                id: s.id as SectionId,
                label: s.label,
                icon: s.icon,
                required: s.required,
              })));
            }}
          />
        </div>
      </div>
    );
  }

  // Tab view (default)
  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className={`border-b px-3 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex gap-1 min-w-max flex-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => {
                // Scroll to section or just show all in drag mode
              }}
              className={`
                px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5
                ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-white'}
              `}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setUseDragMode(true)}
          title="Drag & drop editor"
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ml-1 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* All sections stacked (scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
          {sections.map(section => (
            <div key={section.id} id={`section-${section.id}`}>
              <div className={`flex items-center gap-2 px-4 py-3 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/60'}`}>
                <span className="text-base">{section.icon}</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{section.label}</span>
                {section.required && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>Required</span>
                )}
              </div>
              <div className={isDark ? 'bg-gray-900' : 'bg-white'}>
                {formMap[section.id]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

