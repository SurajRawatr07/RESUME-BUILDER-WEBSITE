import { Award, Globe, Trophy, Lightbulb, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { Certification, Language } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';

export default function AdditionalSectionsForm() {
  const { resumeData, setResumeData } = useResumeStore();
  const { isDark } = useTheme();
  const [newAchievement, setNewAchievement] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const inputClass = `rounded-xl text-sm transition-colors ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}`;
  const sectionTitle = `text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const cardClass = `p-3 rounded-xl border space-y-2 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`;

  // Certifications
  const addCertification = () => {
    const newCert: Certification = { id: Date.now().toString(), name: '', issuer: '', date: '', link: '' };
    setResumeData({ certifications: [...resumeData.certifications, newCert] });
  };
  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setResumeData({ certifications: resumeData.certifications.map(c => c.id === id ? { ...c, ...updates } : c) });
  };
  const removeCertification = (id: string) => {
    setResumeData({ certifications: resumeData.certifications.filter(c => c.id !== id) });
  };

  // Languages
  const addLanguage = () => {
    const newLang: Language = { id: Date.now().toString(), language: '', proficiency: '' };
    setResumeData({ languages: [...resumeData.languages, newLang] });
  };
  const updateLanguage = (id: string, updates: Partial<Language>) => {
    setResumeData({ languages: resumeData.languages.map(l => l.id === id ? { ...l, ...updates } : l) });
  };
  const removeLanguage = (id: string) => {
    setResumeData({ languages: resumeData.languages.filter(l => l.id !== id) });
  };

  // Achievements
  const addAchievement = () => {
    if (newAchievement.trim()) {
      setResumeData({ achievements: [...resumeData.achievements, newAchievement.trim()] });
      setNewAchievement('');
    }
  };
  const removeAchievement = (index: number) => {
    setResumeData({ achievements: resumeData.achievements.filter((_, i) => i !== index) });
  };

  // Interests
  const addInterest = () => {
    if (newInterest.trim()) {
      setResumeData({ interests: [...resumeData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };
  const removeInterest = (index: number) => {
    setResumeData({ interests: resumeData.interests.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-5 space-y-6">
      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`${sectionTitle} flex items-center gap-1.5`}>
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Certifications</span>
          </span>
          <button onClick={addCertification} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {resumeData.certifications.map(cert => (
            <div key={cert.id} className={cardClass}>
              <div className="flex justify-end">
                <button onClick={() => removeCertification(cert.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={cert.name} onChange={e => updateCertification(cert.id, { name: e.target.value })} placeholder="Certificate name" className={inputClass} />
                <Input value={cert.issuer} onChange={e => updateCertification(cert.id, { issuer: e.target.value })} placeholder="Issuer" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="month" value={cert.date} onChange={e => updateCertification(cert.id, { date: e.target.value })} className={inputClass} />
                <Input value={cert.link || ''} onChange={e => updateCertification(cert.id, { link: e.target.value })} placeholder="Link (optional)" className={inputClass} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Languages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`${sectionTitle} flex items-center gap-1.5`}>
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Languages</span>
          </span>
          <button onClick={addLanguage} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {resumeData.languages.map(lang => (
            <div key={lang.id} className={`flex items-center gap-2 ${cardClass}`}>
              <Input value={lang.language} onChange={e => updateLanguage(lang.id, { language: e.target.value })} placeholder="Language" className={`${inputClass} flex-1`} />
              <Input value={lang.proficiency} onChange={e => updateLanguage(lang.id, { proficiency: e.target.value })} placeholder="Proficiency" className={`${inputClass} flex-1`} />
              <button onClick={() => removeLanguage(lang.id)} className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Achievements */}
      <div>
        <span className={`${sectionTitle} flex items-center gap-1.5 mb-3`}>
          <Trophy className="w-4 h-4 text-indigo-600" />
          <span>Achievements</span>
        </span>
        <div className="flex gap-2 mb-3">
          <Input value={newAchievement} onChange={e => setNewAchievement(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAchievement())} placeholder="Add achievement and press Enter" className={inputClass} />
          <button onClick={addAchievement} className="flex-shrink-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {resumeData.achievements.map((achievement, index) => (
            <div key={index} className={`flex items-start gap-2 p-2.5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <span className="text-xs flex-1 leading-relaxed mt-0.5">{achievement}</span>
              <button onClick={() => removeAchievement(index)} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors mt-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`h-px ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Interests */}
      <div>
        <span className={`${sectionTitle} flex items-center gap-1.5 mb-3`}>
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <span>Interests</span>
        </span>
        <div className="flex gap-2 mb-3">
          <Input value={newInterest} onChange={e => setNewInterest(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())} placeholder="Add interest and press Enter" className={inputClass} />
          <button onClick={addInterest} className="flex-shrink-0 w-9 h-9 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.interests.map((interest, index) => (
            <span key={index} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-green-900/40 text-green-300 border border-green-700/50' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {interest}
              <button onClick={() => removeInterest(index)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
