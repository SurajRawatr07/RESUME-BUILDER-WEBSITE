import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, TemplateType, normalizeTemplateId } from '../types/resume';
import { BASE_DEMO_DATA } from '@/data/demoResumeData';

interface ResumeStore {
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  setResumeData: (data: Partial<ResumeData>) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  resetResume: () => void;
}

export const initialResumeData: ResumeData = {
  ...BASE_DEMO_DATA,
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      selectedTemplate: 'frontend',
      setResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      setSelectedTemplate: (template) =>
        set({ selectedTemplate: normalizeTemplateId(template) }),
      resetResume: () =>
        set({ resumeData: initialResumeData, selectedTemplate: 'frontend' }),
    }),
    {
      name: 'resume-craft-storage-v3',
      // Migrate legacy template names and sanitize any lingering personal info automatically
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.selectedTemplate) {
            state.selectedTemplate = normalizeTemplateId(state.selectedTemplate);
          }
          if (
            !state.resumeData ||
            state.resumeData.fullName === 'Suraj Rawat' ||
            (state.resumeData.email && state.resumeData.email.includes('rawatsuraj'))
          ) {
            state.resumeData = { ...initialResumeData };
          }
        }
      },
    }
  )
);
