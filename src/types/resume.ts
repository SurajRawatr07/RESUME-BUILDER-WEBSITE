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
  // 12 Core Role-Vetted Technology Templates
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'sde'
  | 'faang'
  | 'cs-it'
  | 'devops'
  | 'data-python'
  | 'mobile'
  | 'fresher'
  | 'opensource'
  | 'ui-frontend'
  // Legacy Aliases for Seamless Backward Compatibility
  | 'software-engineer'
  | 'swe-resume'
  | 'faangpath-simple'
  | 'cs-it-swe'
  | 'software-engineering'
  | 'resume-professional-swe'
  | 'undergraduate-cv'
  | 'modern-simple-cv'
  | 'resume-cv'
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
  | 'corporate';

export function normalizeTemplateId(id: TemplateType | string): TemplateType {
  switch (id) {
    case 'frontend':
      return 'frontend';
    case 'backend':
      return 'backend';
    case 'fullstack':
    case 'swe-resume':
    case 'swe-resume-template':
      return 'fullstack';
    case 'sde':
    case 'software-engineer':
    case 'software-engineering':
    case 'software-engineering-resume':
    case 'resume-professional-swe':
    case 'corporate':
      return 'sde';
    case 'faang':
    case 'faangpath-simple':
    case 'faangpath-simple-template':
      return 'faang';
    case 'cs-it':
    case 'cs-it-swe':
    case 'cs-it-swe-resume':
      return 'cs-it';
    case 'devops':
      return 'devops';
    case 'data-python':
    case 'data-analyst':
    case 'ai-ml-engineer':
      return 'data-python';
    case 'mobile':
      return 'mobile';
    case 'fresher':
    case 'student-fresher':
    case 'undergraduate-cv':
      return 'fresher';
    case 'opensource':
    case 'creative-general':
    case 'resume-cv':
      return 'opensource';
    case 'ui-frontend':
    case 'modern-simple-cv':
    case 'ui-ux-designer':
    case 'modern':
    case 'minimal':
    case 'creative':
    case 'product-manager':
    case 'business-marketing':
    case 'finance-consulting':
      return 'ui-frontend';
    default:
      return 'frontend';
  }
}
