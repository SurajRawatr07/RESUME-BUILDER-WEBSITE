import { ResumeData, TemplateType } from '@/types/resume';
import { BASE_DEMO_DATA } from '@/data/demoResumeData';

export interface ResumeVersion {
  id: string;
  resumeId: string;
  name: string;
  targetRole: string;
  selectedTemplate: TemplateType;
  atsScore: number;
  jobMatchScore?: number;
  jobDescription?: string;
  resumeData: ResumeData;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface JobDescriptionRecord {
  id: string;
  title: string;
  company?: string;
  rawText: string;
  targetRole: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  RESUMES: 'resumecraft_resumes_v2',
  VERSIONS_PREFIX: 'resumecraft_versions_',
  LATEST_JD: 'resumecraft_latest_jd_v2',
  PREFERENCES: 'resumecraft_user_preferences',
};

function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] Failed to parse key ${key}:`, err);
    return fallback;
  }
}

function safeSetJSON<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write key ${key}:`, err);
    return false;
  }
}

export const versionStorage = {
  getVersions(resumeId: string): ResumeVersion[] {
    const key = `${STORAGE_KEYS.VERSIONS_PREFIX}${resumeId}`;
    const versions = safeGetJSON<ResumeVersion[]>(key, []);
    return versions;
  },

  saveVersion(resumeId: string, version: ResumeVersion): ResumeVersion[] {
    const key = `${STORAGE_KEYS.VERSIONS_PREFIX}${resumeId}`;
    const versions = safeGetJSON<ResumeVersion[]>(key, []);
    const existingIndex = versions.findIndex((v) => v.id === version.id);

    let updated: ResumeVersion[];
    if (existingIndex >= 0) {
      updated = [...versions];
      updated[existingIndex] = { ...version, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        ...versions,
        { ...version, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
    }
    safeSetJSON(key, updated);
    return updated;
  },

  deleteVersion(resumeId: string, versionId: string): ResumeVersion[] {
    const key = `${STORAGE_KEYS.VERSIONS_PREFIX}${resumeId}`;
    const versions = safeGetJSON<ResumeVersion[]>(key, []);
    const updated = versions.filter((v) => v.id !== versionId);
    safeSetJSON(key, updated);
    return updated;
  },

  setActiveVersion(resumeId: string, versionId: string): ResumeVersion | null {
    const key = `${STORAGE_KEYS.VERSIONS_PREFIX}${resumeId}`;
    const versions = safeGetJSON<ResumeVersion[]>(key, []);
    let activeVersion: ResumeVersion | null = null;
    const updated = versions.map((v) => {
      const isTarget = v.id === versionId;
      if (isTarget) activeVersion = v;
      return { ...v, isActive: isTarget };
    });
    safeSetJSON(key, updated);
    return activeVersion;
  },

  createInitialVersionIfEmpty(
    resumeId: string,
    title: string,
    template: TemplateType,
    atsScore: number,
    resumeData: ResumeData
  ): ResumeVersion[] {
    const key = `${STORAGE_KEYS.VERSIONS_PREFIX}${resumeId}`;
    const versions = safeGetJSON<ResumeVersion[]>(key, []);
    if (versions.length === 0) {
      const initial: ResumeVersion = {
        id: `ver-${Date.now()}-1`,
        resumeId,
        name: title || 'Primary Version',
        targetRole: resumeData.jobTitle || 'Software Engineer',
        selectedTemplate: template,
        atsScore,
        resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      safeSetJSON(key, [initial]);
      return [initial];
    }
    return versions;
  },
};

export const jobDescriptionStorage = {
  getLatest(): JobDescriptionRecord | null {
    return safeGetJSON<JobDescriptionRecord | null>(STORAGE_KEYS.LATEST_JD, null);
  },

  save(data: { rawText: string; title?: string; company?: string; targetRole?: string }): JobDescriptionRecord {
    const record: JobDescriptionRecord = {
      id: `jd-${Date.now()}`,
      rawText: data.rawText,
      title: data.title || 'Target Job Description',
      company: data.company || '',
      targetRole: data.targetRole || 'Full Stack Developer',
      updatedAt: new Date().toISOString(),
    };
    safeSetJSON(STORAGE_KEYS.LATEST_JD, record);
    return record;
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.LATEST_JD);
    } catch (err) {
      console.warn('[storage] Failed to clear JD:', err);
    }
  },
};

export const preferencesStorage = {
  get<T>(key: string, defaultValue: T): T {
    const all = safeGetJSON<Record<string, unknown>>(STORAGE_KEYS.PREFERENCES, {});
    return (all[key] as T) ?? defaultValue;
  },

  set<T>(key: string, value: T): void {
    const all = safeGetJSON<Record<string, unknown>>(STORAGE_KEYS.PREFERENCES, {});
    all[key] = value;
    safeSetJSON(STORAGE_KEYS.PREFERENCES, all);
  },
};

export const userPreferencesStorage = {
  ...preferencesStorage,
  getLastSelectedTemplate(): TemplateType | null {
    return preferencesStorage.get<TemplateType | null>('lastSelectedTemplate', null);
  },
  setLastSelectedTemplate(template: TemplateType): void {
    preferencesStorage.set('lastSelectedTemplate', template);
  },
};

