import { useResumeStore } from '@/stores/resumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/context/ThemeContext';

export default function PersonalInfoForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();

  const inputClass = `rounded-xl transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const labelClass = `text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const hintClass = `text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`;

  return (
    <div className="p-5 space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="fullName" className={labelClass}>Full Name *</Label>
          <Input id="fullName" value={resumeData.fullName} onChange={e => setResumeData({ fullName: e.target.value })} placeholder="Suraj Rawat" className={inputClass} />
        </div>
        <div>
          <Label htmlFor="jobTitle" className={labelClass}>Job Title *</Label>
          <Input id="jobTitle" value={resumeData.jobTitle} onChange={e => setResumeData({ jobTitle: e.target.value })} placeholder="Senior Software Engineer" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email" className={labelClass}>Email *</Label>
            <Input id="email" type="email" value={resumeData.email} onChange={e => setResumeData({ email: e.target.value })} placeholder="john@email.com" className={inputClass} />
          </div>
          <div>
            <Label htmlFor="phone" className={labelClass}>Phone *</Label>
            <Input id="phone" type="tel" value={resumeData.phone} onChange={e => setResumeData({ phone: e.target.value })} placeholder="+1 (555) 123-4567" className={inputClass} />
          </div>
        </div>
        <div>
          <Label htmlFor="location" className={labelClass}>Location *</Label>
          <Input id="location" value={resumeData.location} onChange={e => setResumeData({ location: e.target.value })} placeholder="San Francisco, CA" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="linkedin" className={labelClass}>LinkedIn</Label>
            <Input id="linkedin" value={resumeData.linkedin || ''} onChange={e => setResumeData({ linkedin: e.target.value })} placeholder="linkedin.com/in/username" className={inputClass} />
          </div>
          <div>
            <Label htmlFor="github" className={labelClass}>GitHub</Label>
            <Input id="github" value={resumeData.github || ''} onChange={e => setResumeData({ github: e.target.value })} placeholder="github.com/username" className={inputClass} />
          </div>
          <div>
            <Label htmlFor="leetcode" className={labelClass}>LeetCode</Label>
            <Input id="leetcode" value={resumeData.leetcode || ''} onChange={e => setResumeData({ leetcode: e.target.value })} placeholder="leetcode.com/username" className={inputClass} />
          </div>
          <div>
            <Label htmlFor="portfolio" className={labelClass}>Portfolio / Web</Label>
            <Input id="portfolio" value={resumeData.portfolio || ''} onChange={e => setResumeData({ portfolio: e.target.value })} placeholder="yourportfolio.com" className={inputClass} />
          </div>
        </div>
        <div>
          <Label htmlFor="aboutMe" className={labelClass}>About Me</Label>
          <Textarea id="aboutMe" value={resumeData.aboutMe} onChange={e => setResumeData({ aboutMe: e.target.value })} placeholder="Brief introduction about yourself" rows={2} className={inputClass} />
          <p className={hintClass}>Short tagline displayed in some templates</p>
        </div>
        <div>
          <Label htmlFor="summary" className={labelClass}>Professional Summary *</Label>
          <Textarea id="summary" value={resumeData.summary} onChange={e => setResumeData({ summary: e.target.value })} placeholder="Compelling summary of your professional background and achievements" rows={4} className={inputClass} />
          <p className={hintClass}>2-3 sentences highlighting your key strengths</p>
        </div>
      </div>
    </div>
  );
}
