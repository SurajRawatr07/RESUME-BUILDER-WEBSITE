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
  // 9 Role-Specific Overleaf/LaTeX Professional Templates
  | 'software-engineer'
  | 'data-analyst'
  | 'ai-ml-engineer'
  | 'ui-ux-designer'
  | 'product-manager'
  | 'business-marketing'
  | 'finance-consulting'
  | 'student-fresher'
  | 'creative-general'
  // Legacy Aliases for Seamless Backward Compatibility
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
    case 'data-analyst':
    case 'ai-ml-engineer':
    case 'ui-ux-designer':
    case 'product-manager':
    case 'business-marketing':
    case 'finance-consulting':
    case 'student-fresher':
    case 'creative-general':
      return id;
    case 'modern':
      return 'software-engineer';
    case 'minimal':
      return 'finance-consulting';
    case 'creative':
      return 'ui-ux-designer';
    case 'frontend':
      return 'software-engineer';
    case 'backend':
      return 'ai-ml-engineer';
    case 'fullstack':
      return 'software-engineer';
    case 'corporate':
      return 'product-manager';
    default:
      return 'software-engineer';
  }
}
