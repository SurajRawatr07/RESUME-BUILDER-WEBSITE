export interface ResumeData {
  // Personal Info
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  
  // Professional Links
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
  leetcode?: string;
  
  // Profile
  aboutMe: string;
  summary: string;
  
  // Experience
  experiences: Experience[];
  
  // Education
  education: Education[];
  
  // Projects
  projects: Project[];
  
  // Skills & Technologies
  skills: string[];
  technologies: string[];
  
  // Additional Sections
  certifications: Certification[];
  achievements: string[];
  languages: Language[];
  interests: string[];
  publications?: string[];
  leadership?: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  description: string;
  coursework?: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  startDate: string;
  endDate: string;
  description: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
}

export type TemplateType =
  // 9 Real Overleaf/LaTeX Professional Templates
  | 'software-engineer'
  | 'swe-resume'
  | 'faangpath-simple'
  | 'cs-it-swe'
  | 'software-engineering'
  | 'resume-professional-swe'
  | 'undergraduate-cv'
  | 'modern-simple-cv'
  | 'resume-cv'
  // Legacy Aliases for Seamless Backward Compatibility
  | 'data-analyst'
  | 'ai-ml-engineer'
  | 'ui-ux-designer'
  | 'product-manager'
  | 'business-marketing'
  | 'finance-consulting'
  | 'student-fresher'
  | 'creative-general'
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'corporate';

export function normalizeTemplateId(id: TemplateType | string): TemplateType {
  switch (id) {
    case 'software-engineer':
    case 'swe-resume':
    case 'faangpath-simple':
    case 'cs-it-swe':
    case 'software-engineering':
    case 'resume-professional-swe':
    case 'undergraduate-cv':
    case 'modern-simple-cv':
    case 'resume-cv':
      return id as TemplateType;
    case 'modern':
      return 'software-engineer';
    case 'swe-resume-template':
      return 'swe-resume';
    case 'faangpath-simple-template':
      return 'faangpath-simple';
    case 'cs-it-swe-resume':
      return 'cs-it-swe';
    case 'software-engineering-resume':
      return 'software-engineering';
    case 'data-analyst':
      return 'cs-it-swe';
    case 'ai-ml-engineer':
      return 'faangpath-simple';
    case 'ui-ux-designer':
      return 'modern-simple-cv';
    case 'product-manager':
      return 'resume-professional-swe';
    case 'business-marketing':
      return 'resume-cv';
    case 'finance-consulting':
      return 'swe-resume';
    case 'student-fresher':
      return 'undergraduate-cv';
    case 'creative-general':
    case 'minimal':
    case 'creative':
      return 'modern-simple-cv';
    case 'frontend':
    case 'backend':
    case 'fullstack':
      return 'software-engineer';
    case 'corporate':
      return 'resume-professional-swe';
    default:
      return 'software-engineer';
  }
}
