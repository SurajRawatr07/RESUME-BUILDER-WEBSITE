import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';

export default function SkillsForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();
  const [newSkill, setNewSkill] = useState('');
  const [newTech, setNewTech] = useState('');

  const inputClass = `rounded-xl transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const labelClass = `text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData({ skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };
  const removeSkill = (index: number) => {
    setResumeData({ skills: resumeData.skills.filter((_, i) => i !== index) });
  };
  const addTechnology = () => {
    if (newTech.trim()) {
      setResumeData({ technologies: [...resumeData.technologies, newTech.trim()] });
      setNewTech('');
    }
  };
  const removeTechnology = (index: number) => {
    setResumeData({ technologies: resumeData.technologies.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-5 space-y-6">
      {/* Soft Skills */}
      <div className="space-y-3">
        <div>
          <Label className={labelClass}>Soft Skills</Label>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Leadership, communication, problem-solving, etc.</p>
        </div>
        <div className="flex gap-2">
          <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Type and press Enter..." className={inputClass} />
          <button onClick={addSkill} className="flex-shrink-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span key={index} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
              {skill}
              <button onClick={() => removeSkill(index)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {resumeData.skills.length === 0 && (
            <p className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No skills added yet</p>
          )}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Technologies */}
      <div className="space-y-3">
        <div>
          <Label className={labelClass}>Technologies & Tools</Label>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Languages, frameworks, databases, cloud platforms, etc.</p>
        </div>
        <div className="flex gap-2">
          <Input value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechnology())} placeholder="React, Python, AWS..." className={inputClass} />
          <button onClick={addTechnology} className="flex-shrink-0 w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.technologies.map((tech, index) => (
            <span key={index} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
              {tech}
              <button onClick={() => removeTechnology(index)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {resumeData.technologies.length === 0 && (
            <p className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No technologies added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
