import { ResumeData, TemplateType } from '@/types/resume';
import { ATSAnalysisResult, calculateATSScore } from './atsEngine';
import { BASE_DEMO_DATA } from '@/data/demoResumeData';

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  totalResumes?: number;
  latestResume?: string;
  lastUpdated?: string;
  templatesUsed?: string[];
  createdAt?: string;
}

export interface ApiResume {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  selectedTemplate: TemplateType;
  atsScore?: number;
  lastAtsAnalysis?: {
    score: number;
    targetJobTitle: string;
    analyzedAt: string;
    status: string;
  };
  resumeData: ResumeData;
  createdAt: string;
  updatedAt: string;
}

interface StoredUser extends UserProfile {
  password?: string;
}

// Storage keys for Frontend-Only persistence
const STORAGE_KEYS = {
  USERS: 'resumecraft_local_users',
  CURRENT_USER: 'resumecraft_local_current_user',
  RESUMES_PREFIX: 'resumecraft_local_resumes_',
};

function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// Default initial user for instant frontend usability
const DEFAULT_DEMO_USER: StoredUser = {
  id: 'usr-demo-1',
  _id: 'usr-demo-1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  password: 'Password123!',
  title: 'Senior Software Engineer',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  bio: 'Crafting high-impact professional resumes with verified ATS compatibility.',
  avatar: '',
  skills: ['TypeScript', 'React', 'Tailwind CSS', 'Next.js', 'System Design'],
  linkedin: 'https://linkedin.com/in/alexrivera',
  github: 'https://github.com/alexrivera',
  portfolio: 'https://alexrivera.dev',
  totalResumes: 1,
  latestResume: "Alex's Resume.pdf",
  lastUpdated: 'Recently',
  templatesUsed: ['frontend'],
  createdAt: new Date().toISOString(),
};

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.warn('[LocalStorage] Failed to persist users:', err);
  }
}

function getCurrentUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to demo user for frontend session
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_USER;
  }
}

function setCurrentUser(user: StoredUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.warn('[LocalStorage] Failed to set current user:', err);
  }
}

function getUserResumes(userId: string): ApiResume[] {
  try {
    const key = `${STORAGE_KEYS.RESUMES_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initialResume: ApiResume = {
        _id: 'res-default-1',
        id: 'res-default-1',
        userId,
        title: "Alex's Resume",
        selectedTemplate: 'frontend',
        resumeData: { ...BASE_DEMO_DATA },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify([initialResume]));
      return [initialResume];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUserResumes(userId: string, resumes: ApiResume[]): void {
  try {
    const key = `${STORAGE_KEYS.RESUMES_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(resumes));
  } catch (err) {
    console.warn('[LocalStorage] Failed to persist resumes:', err);
  }
}

/**
 * Frontend-Only API Client
 * Persists user session and resume data in localStorage.
 * Calculates ATS scores client-side via deterministic TypeScript logic.
 * Structured cleanly so a backend can be connected in the future without changing consumers.
 */
class ApiClient {
  // Auth Methods (LocalStorage-backed)
  auth = {
    register: async (payload: { name: string; email: string; password: string; confirmPassword?: string }) => {
      const trimmedEmail = payload.email.trim().toLowerCase();
      const trimmedName = payload.name.trim();

      if (!trimmedEmail || !payload.password || !trimmedName) {
        throw new Error('Please provide name, email, and password.');
      }

      if (payload.password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const users = getStoredUsers();
      const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists. Please log in.');
      }

      const userId = generateId('usr');
      const newUser: StoredUser = {
        id: userId,
        _id: userId,
        name: trimmedName,
        email: trimmedEmail,
        password: payload.password,
        title: 'Software Professional',
        phone: '',
        location: '',
        bio: 'Crafting high-impact professional resumes.',
        avatar: '',
        skills: ['Problem Solving', 'Communication', 'Technical Leadership'],
        linkedin: '',
        github: '',
        portfolio: '',
        totalResumes: 1,
        latestResume: `${trimmedName.replace(/\s+/g, '_')}_Resume.pdf`,
        lastUpdated: 'Just now',
        templatesUsed: ['frontend'],
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveStoredUsers(users);
      setCurrentUser(newUser);

      // Seed an initial resume for the user
      const initialResume: ApiResume = {
        _id: generateId('res'),
        id: generateId('res'),
        userId,
        title: `${trimmedName}'s Resume`,
        selectedTemplate: 'frontend',
        resumeData: {
          ...BASE_DEMO_DATA,
          fullName: trimmedName,
          email: trimmedEmail,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveUserResumes(userId, [initialResume]);

      return {
        success: true,
        user: newUser,
        token: 'local-session-active',
        message: 'Account created successfully!',
      };
    },

    login: async (payload: { email: string; password: string }) => {
      const trimmedEmail = payload.email.trim().toLowerCase();
      const users = getStoredUsers();
      const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (!user) {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      }

      if (user.password && user.password !== payload.password) {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      }

      setCurrentUser(user);

      return {
        success: true,
        user,
        token: 'local-session-active',
        message: 'Logged in successfully!',
      };
    },

    logout: async () => {
      setCurrentUser(null);
      return { success: true };
    },

    getMe: async () => {
      const user = getCurrentUser();
      if (!user) {
        return { success: false, user: DEFAULT_DEMO_USER };
      }
      return { success: true, user };
    },

    updateProfile: async (data: Partial<UserProfile>) => {
      const current = getCurrentUser();
      if (!current) {
        throw new Error('No user session active.');
      }

      const users = getStoredUsers();
      const updatedUser: StoredUser = {
        ...current,
        ...data,
      };

      const userIndex = users.findIndex((u) => u.id === current.id || u.email === current.email);
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
      } else {
        users.push(updatedUser);
      }

      saveStoredUsers(users);
      setCurrentUser(updatedUser);

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully.',
      };
    },
  };

  // Resume Methods (LocalStorage-backed)
  resumes = {
    getAll: async () => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);
      return {
        success: true,
        resumes,
      };
    },

    getById: async (id: string) => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);
      const found = resumes.find((r) => r._id === id || r.id === id);

      if (!found) {
        throw new Error('Resume not found.');
      }

      return {
        success: true,
        resume: found,
      };
    },

    create: async (data: {
      title?: string;
      selectedTemplate?: string;
      atsScore?: number;
      resumeData?: ResumeData;
    }) => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);

      const resumeId = generateId('res');
      const freshResumeData = data.resumeData || { ...BASE_DEMO_DATA };

      const newResume: ApiResume = {
        _id: resumeId,
        id: resumeId,
        userId,
        title: data.title?.trim() || 'Untitled Resume',
        selectedTemplate: (data.selectedTemplate as TemplateType) || 'frontend',
        atsScore: data.atsScore,
        resumeData: freshResumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedResumes = [newResume, ...resumes];
      saveUserResumes(userId, updatedResumes);

      // Update user stats
      if (user) {
        user.totalResumes = updatedResumes.length;
        user.latestResume = `${newResume.title.replace(/\s+/g, '_')}.pdf`;
        user.lastUpdated = 'Just now';
        setCurrentUser(user);
      }

      return {
        success: true,
        resume: newResume,
        message: 'Resume created successfully.',
      };
    },

    update: async (
      id: string,
      data: {
        title?: string;
        selectedTemplate?: string;
        atsScore?: number;
        resumeData?: ResumeData;
      }
    ) => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);

      const index = resumes.findIndex((r) => r._id === id || r.id === id);
      if (index === -1) {
        throw new Error('Resume not found.');
      }

      const existing = resumes[index];
      const resumeData = data.resumeData || existing.resumeData;
      const atsScore = data.atsScore !== undefined ? data.atsScore : existing.atsScore;

      const updatedResume: ApiResume = {
        ...existing,
        title: data.title !== undefined ? data.title.trim() : existing.title,
        selectedTemplate: (data.selectedTemplate as TemplateType) || existing.selectedTemplate,
        atsScore,
        resumeData,
        updatedAt: new Date().toISOString(),
      };

      resumes[index] = updatedResume;
      saveUserResumes(userId, resumes);

      // Update user stats
      if (user) {
        user.latestResume = `${updatedResume.title.replace(/\s+/g, '_')}.pdf`;
        user.lastUpdated = 'Recently';
        setCurrentUser(user);
      }

      return {
        success: true,
        resume: updatedResume,
        message: 'Resume saved successfully.',
      };
    },

    duplicate: async (id: string) => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);

      const existing = resumes.find((r) => r._id === id || r.id === id);
      if (!existing) {
        throw new Error('Resume not found.');
      }

      const dupId = generateId('res');
      const duplicatedResume: ApiResume = {
        ...existing,
        _id: dupId,
        id: dupId,
        title: `${existing.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedResumes = [duplicatedResume, ...resumes];
      saveUserResumes(userId, updatedResumes);

      return {
        success: true,
        resume: duplicatedResume,
        message: 'Resume duplicated successfully.',
      };
    },

    delete: async (id: string) => {
      const user = getCurrentUser();
      const userId = user?.id || 'usr-demo-1';
      const resumes = getUserResumes(userId);

      const filtered = resumes.filter((r) => r._id !== id && r.id !== id);
      saveUserResumes(userId, filtered);

      if (user) {
        user.totalResumes = filtered.length;
        setCurrentUser(user);
      }

      return {
        success: true,
        message: 'Resume deleted successfully.',
      };
    },
  };

  // ATS Analysis (Frontend TypeScript calculation)
  ats = {
    analyze: async (data: { resumeData: ResumeData; targetRole?: string; jobDescription?: string }) => {
      const result = calculateATSScore(data.resumeData, data.targetRole, data.jobDescription);
      return {
        success: true,
        data: result,
      };
    },
  };
}

export const api = new ApiClient();
