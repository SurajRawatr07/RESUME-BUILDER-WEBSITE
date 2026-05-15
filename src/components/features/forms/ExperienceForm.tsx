import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { Experience } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/context/ThemeContext';

export default function ExperienceForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();

  const inputClass = `rounded-xl transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const labelClass = `text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const cardClass = `p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`;

  const addExperience = () => {
    const newExperience: Experience = { id: Date.now().toString(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    setResumeData({ experiences: [...resumeData.experiences, newExperience] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setResumeData({ experiences: resumeData.experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp) });
  };

  const removeExperience = (id: string) => {
    setResumeData({ experiences: resumeData.experiences.filter(exp => exp.id !== id) });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Add your work history</p>
        <Button onClick={addExperience} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
        </Button>
      </div>

      <div className="space-y-4">
        {resumeData.experiences.map((exp, index) => (
          <div key={exp.id} className={cardClass}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>#{index + 1}</span>
              <button onClick={() => removeExperience(exp.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Remove">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <Label className={labelClass}>Job Title *</Label>
              <Input value={exp.jobTitle} onChange={e => updateExperience(exp.id, { jobTitle: e.target.value })} placeholder="Senior Software Engineer" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={labelClass}>Company *</Label>
                <Input value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} placeholder="Tech Solutions Inc." className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>Location</Label>
                <Input value={exp.location} onChange={e => updateExperience(exp.id, { location: e.target.value })} placeholder="SF, CA" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={labelClass}>Start Date *</Label>
                <Input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, { startDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>End Date</Label>
                <Input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, { endDate: e.target.value })} disabled={exp.current} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`current-${exp.id}`} checked={exp.current} onCheckedChange={checked => updateExperience(exp.id, { current: checked as boolean, endDate: '' })} />
              <label htmlFor={`current-${exp.id}`} className={`text-xs cursor-pointer ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Currently working here</label>
            </div>
            <div>
              <Label className={labelClass}>Description *</Label>
              <Textarea value={exp.description} onChange={e => updateExperience(exp.id, { description: e.target.value })} placeholder="Key responsibilities and achievements..." rows={3} className={inputClass} />
            </div>
          </div>
        ))}

        {resumeData.experiences.length === 0 && (
          <div className={`text-center py-8 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <p className="text-sm">No experience added yet</p>
            <button onClick={addExperience} className="text-indigo-500 text-sm font-medium mt-1 hover:text-indigo-600">+ Add your first entry</button>
          </div>
        )}
      </div>
    </div>
  );
}
