import { create } from 'zustand';
import { ResumeData, TemplateType, normalizeTemplateId } from '../types/resume';
import { BASE_DEMO_DATA } from '@/data/demoResumeData';
import { api, ApiResume } from '@/lib/api';
import { calculateATSScore } from '@/lib/atsEngine';

interface ResumeStore {
  currentResumeId: string | null;
  currentResumeTitle: string;
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  savedResumes: ApiResume[];
  isLoadingResumes: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  atsScore: number;

  // Actions
  setResumeData: (data: Partial<ResumeData>) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  setCurrentResumeTitle: (title: string) => void;
  resetResume: () => void;

  // Backend Async Actions
  fetchUserResumes: () => Promise<ApiResume[]>;
  selectResumeToEdit: (resume: ApiResume) => void;
  loadResumeById: (id: string) => Promise<boolean>;
  createNewResume: (title?: string, template?: TemplateType) => Promise<ApiResume | null>;
  saveCurrentResume: () => Promise<boolean>;
  duplicateResume: (id: string) => Promise<ApiResume | null>;
  deleteResume: (id: string) => Promise<boolean>;
}

export const initialResumeData: ResumeData = {
  ...BASE_DEMO_DATA,
};

let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useResumeStore = create<ResumeStore>()((set, get) => ({
  currentResumeId: null,
  currentResumeTitle: 'My Resume',
  resumeData: initialResumeData,
  selectedTemplate: 'frontend',
  savedResumes: [],
  isLoadingResumes: false,
  isSaving: false,
  lastSavedAt: null,
  atsScore: 78,

  setResumeData: (data) => {
    set((state) => {
      const updatedResume = { ...state.resumeData, ...data };
      const atsResult = calculateATSScore(updatedResume);
      return {
        resumeData: updatedResume,
        atsScore: atsResult.score,
      };
    });

    // Debounced background auto-save to localStorage
    if (get().currentResumeId) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        get().saveCurrentResume();
      }, 1200);
    }
  },

  setSelectedTemplate: (template) => {
    const norm = normalizeTemplateId(template);
    set({ selectedTemplate: norm });

    if (get().currentResumeId) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        get().saveCurrentResume();
      }, 800);
    }
  },

  setCurrentResumeTitle: (title) => {
    set({ currentResumeTitle: title });

    if (get().currentResumeId) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        get().saveCurrentResume();
      }, 800);
    }
  },

  resetResume: () =>
    set({
      currentResumeId: null,
      currentResumeTitle: 'My Resume',
      resumeData: initialResumeData,
      selectedTemplate: 'frontend',
      atsScore: 78,
      lastSavedAt: null,
    }),

  fetchUserResumes: async () => {
    set({ isLoadingResumes: true });
    try {
      const res = await api.resumes.getAll();
      if (res.success && Array.isArray(res.resumes)) {
        set({ savedResumes: res.resumes });

        // If no active resume is selected, choose the most recent one
        const currentId = get().currentResumeId;
        const exists = res.resumes.some((r) => String(r._id) === String(currentId));
        if (!exists && res.resumes.length > 0) {
          const first = res.resumes[0];
          get().selectResumeToEdit(first);
        }

        return res.resumes;
      }
      return [];
    } catch (err) {
      console.error('[Store] Failed to fetch resumes from backend:', err);
      return [];
    } finally {
      set({ isLoadingResumes: false });
    }
  },

  selectResumeToEdit: (resume: ApiResume) => {
    const template = normalizeTemplateId(resume.selectedTemplate || 'frontend');
    const resumeData = resume.resumeData || initialResumeData;
    const atsResult = calculateATSScore(resumeData);

    set({
      currentResumeId: String(resume._id),
      currentResumeTitle: resume.title || 'My Resume',
      selectedTemplate: template,
      resumeData,
      atsScore: resume.atsScore || atsResult.score,
      lastSavedAt: resume.updatedAt || new Date().toISOString(),
    });
  },

  loadResumeById: async (id: string) => {
    try {
      const res = await api.resumes.getById(id);
      if (res.success && res.resume) {
        get().selectResumeToEdit(res.resume);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`[Store] Failed to load resume ${id}:`, err);
      return false;
    }
  },

  createNewResume: async (title = 'Untitled Resume', template: TemplateType = 'frontend') => {
    set({ isSaving: true });
    try {
      const freshData = { ...initialResumeData };
      const atsResult = calculateATSScore(freshData);

      const res = await api.resumes.create({
        title,
        selectedTemplate: template,
        atsScore: atsResult.score,
        resumeData: freshData,
      });

      if (res.success && res.resume) {
        set((state) => ({
          savedResumes: [res.resume, ...state.savedResumes],
          currentResumeId: String(res.resume._id),
          currentResumeTitle: res.resume.title,
          selectedTemplate: normalizeTemplateId(res.resume.selectedTemplate),
          resumeData: res.resume.resumeData || freshData,
          atsScore: res.resume.atsScore || atsResult.score,
          lastSavedAt: res.resume.updatedAt,
        }));
        return res.resume;
      }
      return null;
    } catch (err) {
      console.error('[Store] Failed to create resume in backend:', err);
      return null;
    } finally {
      set({ isSaving: false });
    }
  },

  saveCurrentResume: async () => {
    const { currentResumeId, currentResumeTitle, selectedTemplate, resumeData, atsScore } = get();
    if (!currentResumeId) {
      // Create new on backend if none exists yet
      const created = await get().createNewResume(currentResumeTitle, selectedTemplate);
      return !!created;
    }

    set({ isSaving: true });
    try {
      const calculatedAts = calculateATSScore(resumeData).score;
      const res = await api.resumes.update(currentResumeId, {
        title: currentResumeTitle,
        selectedTemplate,
        atsScore: calculatedAts,
        resumeData,
      });

      if (res.success && res.resume) {
        set((state) => ({
          lastSavedAt: new Date().toISOString(),
          atsScore: calculatedAts,
          savedResumes: state.savedResumes.map((r) =>
            String(r._id) === String(currentResumeId) ? res.resume : r
          ),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Store] Failed to save resume to backend:', err);
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  duplicateResume: async (id: string) => {
    try {
      const res = await api.resumes.duplicate(id);
      if (res.success && res.resume) {
        set((state) => ({
          savedResumes: [res.resume, ...state.savedResumes],
        }));
        return res.resume;
      }
      return null;
    } catch (err) {
      console.error('[Store] Failed to duplicate resume:', err);
      return null;
    }
  },

  deleteResume: async (id: string) => {
    try {
      const res = await api.resumes.delete(id);
      if (res.success) {
        set((state) => {
          const filtered = state.savedResumes.filter((r) => String(r._id) !== String(id));
          const isCurrentDeleted = String(state.currentResumeId) === String(id);
          return {
            savedResumes: filtered,
            ...(isCurrentDeleted && filtered.length > 0
              ? {
                  currentResumeId: String(filtered[0]._id),
                  currentResumeTitle: filtered[0].title,
                  selectedTemplate: normalizeTemplateId(filtered[0].selectedTemplate),
                  resumeData: filtered[0].resumeData,
                  atsScore: filtered[0].atsScore,
                }
              : isCurrentDeleted
              ? {
                  currentResumeId: null,
                  currentResumeTitle: 'My Resume',
                  resumeData: initialResumeData,
                }
              : {}),
          };
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Store] Failed to delete resume:', err);
      return false;
    }
  },
}));
