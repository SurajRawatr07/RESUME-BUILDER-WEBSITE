import React from 'react';
import { ResumeData, TemplateType, normalizeTemplateId } from '@/types/resume';
import SoftwareEngineerTemplate from './SoftwareEngineerTemplate';
import SWEResumeTemplate from './SWEResumeTemplate';
import FAANGPathTemplate from './FAANGPathTemplate';
import CSITSweTemplate from './CSITSweTemplate';
import SoftwareEngineeringResumeTemplate from './SoftwareEngineeringResumeTemplate';
import ResumeProfessionalSWETemplate from './ResumeProfessionalSWETemplate';
import UndergraduateCVTemplate from './UndergraduateCVTemplate';
import ModernSimpleCVTemplate from './ModernSimpleCVTemplate';
import ResumeCVTemplate from './ResumeCVTemplate';

export type TemplateCategory =
  | 'All'
  | 'Software / IT'
  | 'Student'
  | 'Engineering'
  | 'General';

export interface TemplateDefinition {
  id: TemplateType;
  name: string;
  role: string;
  category: TemplateCategory;
  description: string;
  bestFor: string;
  tag: string;
  structureNote: string;
  component: React.ComponentType<{ data: ResumeData }>;
  sectionHierarchy: string[];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'All',
  'Software / IT',
  'Student',
  'Engineering',
  'General',
];

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer Resume',
    role: 'Software Engineer',
    category: 'Software / IT',
    description: 'Compact single-column ATS format based on standard Overleaf software engineering resumes. Clean horizontal rules with zero decorative graphics.',
    bestFor: 'Software Engineers, Full-Stack Developers, Backend / Frontend Engineers, SDE I/II/III',
    tag: 'Overleaf SWE',
    structureNote: 'Contact → Education → Experience → Projects → Programming/Technical Skills',
    component: SoftwareEngineerTemplate,
    sectionHierarchy: ['Contact & Links', 'Education', 'Experience', 'Projects', 'Technical Skills'],
  },
  {
    id: 'swe-resume',
    name: 'SWE Resume Template',
    role: 'Software Engineer / Full-Stack',
    category: 'Software / IT',
    description: 'Clean ATS-oriented software developer structure inspired by Overleaf SWE templates. Compact typography with right-aligned dates and metrics.',
    bestFor: 'Full-Stack Developers, Software Engineers, Systems Programmers',
    tag: 'ATS Developer',
    structureNote: 'Contact → Education → Experience → Projects → Technical Skills → Achievements',
    component: SWEResumeTemplate,
    sectionHierarchy: ['Contact', 'Education', 'Experience', 'Projects', 'Technical Skills', 'Achievements'],
  },
  {
    id: 'faangpath-simple',
    name: 'FAANGPath Simple Template',
    role: 'SWE / Tech Specialist',
    category: 'Software / IT',
    description: 'Minimal, clean, compact ATS-readable hierarchy based on the popular FAANGPath template. Engineered for top tech screening systems.',
    bestFor: 'Tech Candidates, New Grads, FAANG / Big Tech Applicants',
    tag: 'FAANGPath',
    structureNote: 'Header → Education → Experience → Projects → Categorized Skills',
    component: FAANGPathTemplate,
    sectionHierarchy: ['Header', 'Education', 'Experience', 'Projects', 'Technical Skills'],
  },
  {
    id: 'cs-it-swe',
    name: 'CS/IT/SWE Resume Template',
    role: 'Computer Science & IT',
    category: 'Engineering',
    description: 'Computer Science & Information Technology resume structure prioritizing technical competencies, followed by Education, Experience, and Certifications.',
    bestFor: 'Computer Science Majors, IT Specialists, Software Engineers, DevOps',
    tag: 'CS / IT Standard',
    structureNote: 'Technical Skills (Top) → Education → Experience → Projects → Certifications',
    component: CSITSweTemplate,
    sectionHierarchy: ['Technical Skills', 'Education', 'Experience', 'Projects', 'Certifications'],
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering Resume',
    role: 'Software Engineer',
    category: 'Engineering',
    description: 'Clean software-engineering-oriented structure with summary statement, production experience, technical skills, and academic qualifications.',
    bestFor: 'Experienced Software Engineers, Backend Architects, Engineering Leads',
    tag: 'Software Eng.',
    structureNote: 'Contact → Summary → Experience → Projects → Skills → Education',
    component: SoftwareEngineeringResumeTemplate,
    sectionHierarchy: ['Contact', 'Summary', 'Experience', 'Projects', 'Skills', 'Education'],
  },
  {
    id: 'resume-professional-swe',
    name: 'Resume Professional Template - Software Engineer',
    role: 'Senior Software Engineer / Architect',
    category: 'Engineering',
    description: 'Restrained, authoritative engineering hierarchy with clear title distinction, verified ATS formatting, and prominent architectural achievements.',
    bestFor: 'Senior Engineers, Tech Leads, Solutions Architects, Engineering Managers',
    tag: 'Professional SWE',
    structureNote: 'Strong Header → Education → Technical Skills → Experience → Projects → Certifications',
    component: ResumeProfessionalSWETemplate,
    sectionHierarchy: ['Header', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications'],
  },
  {
    id: 'undergraduate-cv',
    name: 'Undergraduate CV Template',
    role: 'Student / Fresher / Researcher',
    category: 'Student',
    description: 'Academic-first CV template for undergraduates, interns, freshers, and research candidates. Features prominent coursework, GPA, and projects.',
    bestFor: 'College Students, Freshers, Tech Internships, Research & Graduate Admissions',
    tag: 'Undergraduate CV',
    structureNote: 'Education (Top) → Skills & Coursework → Projects → Experience → Publications → Honors',
    component: UndergraduateCVTemplate,
    sectionHierarchy: ['Education (Top)', 'Skills & Coursework', 'Projects', 'Experience', 'Honors & Awards'],
  },
  {
    id: 'modern-simple-cv',
    name: 'Modern Simple CV',
    role: 'General Professional / Tech',
    category: 'General',
    description: 'Typography-focused, minimal, clean, spacious layout with zero decorative noise or arbitrary charts. Maximum cross-industry readability.',
    bestFor: 'General Tech, UI/UX, Product, Operations, Cross-Disciplinary Roles',
    tag: 'Modern Simple',
    structureNote: 'Clean Header → Summary → Experience → Skills → Projects → Education',
    component: ModernSimpleCVTemplate,
    sectionHierarchy: ['Header', 'Summary', 'Experience', 'Skills', 'Projects', 'Education'],
  },
  {
    id: 'resume-cv',
    name: 'Resume / CV',
    role: 'General Professional / Experienced',
    category: 'General',
    description: 'Standard Overleaf-inspired multi-purpose CV. Suitable for experienced candidates, career switchers, and general business or technical specialists.',
    bestFor: 'Career Switchers, Experienced Professionals, Multi-Disciplinary Specialists',
    tag: 'Standard CV',
    structureNote: 'Professional Header → Summary → Experience → Skills → Projects → Education → Certifications',
    component: ResumeCVTemplate,
    sectionHierarchy: ['Header', 'Summary', 'Experience', 'Skills', 'Projects', 'Education'],
  },
];

export function getTemplateById(id: TemplateType | string): TemplateDefinition {
  const normalized = normalizeTemplateId(id);
  const found = TEMPLATES.find((t) => t.id === normalized);
  return found || TEMPLATES[0];
}
