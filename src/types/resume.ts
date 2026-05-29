
  //
  // Projects
  erface Experience {
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
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'frontend'
  | 'backend'
  | 'software-engineer'
  | 'fullstack'
  | 'corporate';
