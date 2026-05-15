import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { Project } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/context/ThemeContext';

export default function ProjectsForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();

  const inputClass = `rounded-xl transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const labelClass = `text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const cardClass = `p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`;

  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), title: '', technologies: '', startDate: '', endDate: '', description: '', link: '' };
    setResumeData({ projects: [...resumeData.projects, newProject] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setResumeData({ projects: resumeData.projects.map(proj => proj.id === id ? { ...proj, ...updates } : proj) });
  };

  const removeProject = (id: string) => {
    setResumeData({ projects: resumeData.projects.filter(proj => proj.id !== id) });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Showcase your key projects</p>
        <button onClick={addProject} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {resumeData.projects.map((proj, index) => (
          <div key={proj.id} className={cardClass}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Project #{index + 1}</span>
              <button onClick={() => removeProject(proj.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <Label className={labelClass}>Project Title *</Label>
              <Input value={proj.title} onChange={e => updateProject(proj.id, { title: e.target.value })} placeholder="E-Commerce Platform" className={inputClass} />
            </div>
            <div>
              <Label className={labelClass}>Technologies Used *</Label>
              <Input value={proj.technologies} onChange={e => updateProject(proj.id, { technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={labelClass}>Start Date</Label>
                <Input type="month" value={proj.startDate} onChange={e => updateProject(proj.id, { startDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>End Date</Label>
                <Input type="month" value={proj.endDate} onChange={e => updateProject(proj.id, { endDate: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <Label className={labelClass}>Project Link</Label>
              <Input value={proj.link || ''} onChange={e => updateProject(proj.id, { link: e.target.value })} placeholder="github.com/username/project" className={inputClass} />
            </div>
            <div>
              <Label className={labelClass}>Description *</Label>
              <Textarea value={proj.description} onChange={e => updateProject(proj.id, { description: e.target.value })} placeholder="Describe the project, your role, and key achievements..." rows={3} className={inputClass} />
            </div>
          </div>
        ))}

        {resumeData.projects.length === 0 && (
          <div className={`text-center py-8 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <p className="text-sm">No projects added yet</p>
            <button onClick={addProject} className="text-indigo-500 text-sm font-medium mt-1 hover:text-indigo-600">+ Add your first project</button>
          </div>
        )}
      </div>
    </div>
  );
}
