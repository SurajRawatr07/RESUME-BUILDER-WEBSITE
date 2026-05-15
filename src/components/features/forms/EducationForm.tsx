import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/context/ThemeContext';

export default function EducationForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();

  const inputClass = `rounded-xl transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const labelClass = `text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const cardClass = `p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`;

  const addEducation = () => {
    const newEducation: Education = { id: Date.now().toString(), degree: '', institution: '', location: '', graduationDate: '', gpa: '', description: '' };
    setResumeData({ education: [...resumeData.education, newEducation] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setResumeData({ education: resumeData.education.map(edu => edu.id === id ? { ...edu, ...updates } : edu) });
  };

  const removeEducation = (id: string) => {
    setResumeData({ education: resumeData.education.filter(edu => edu.id !== id) });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Add your educational background</p>
        <button onClick={addEducation} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Entry
        </button>
      </div>

      <div className="space-y-4">
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className={cardClass}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>#{index + 1}</span>
              <button onClick={() => removeEducation(edu.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <Label className={labelClass}>Degree *</Label>
              <Input value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} placeholder="B.Sc. Computer Science" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={labelClass}>Institution *</Label>
                <Input value={edu.institution} onChange={e => updateEducation(edu.id, { institution: e.target.value })} placeholder="UC Berkeley" className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>Location</Label>
                <Input value={edu.location} onChange={e => updateEducation(edu.id, { location: e.target.value })} placeholder="Berkeley, CA" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={labelClass}>Graduation Date *</Label>
                <Input type="month" value={edu.graduationDate} onChange={e => updateEducation(edu.id, { graduationDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>GPA</Label>
                <Input value={edu.gpa || ''} onChange={e => updateEducation(edu.id, { gpa: e.target.value })} placeholder="3.8" className={inputClass} />
              </div>
            </div>
            <div>
              <Label className={labelClass}>Description</Label>
              <Textarea value={edu.description} onChange={e => updateEducation(edu.id, { description: e.target.value })} placeholder="Relevant coursework, honors..." rows={2} className={inputClass} />
            </div>
          </div>
        ))}

        {resumeData.education.length === 0 && (
          <div className={`text-center py-8 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <p className="text-sm">No education added yet</p>
            <button onClick={addEducation} className="text-indigo-500 text-sm font-medium mt-1 hover:text-indigo-600">+ Add your degree</button>
          </div>
        )}
      </div>
    </div>
  );
}
