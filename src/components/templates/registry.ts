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
    role: 'Backend & Systems Developer',
    category: 'Software / IT',
    description: 'Single-column ATS format with structured summary, technical competencies, backend engineering, and systems experience.',
    bestFor: 'Software Engineer / Backend Developer',
    tag: 'Overleaf SWE',
    structureNote: 'Contact → Summary → Technical Skills → Experience → Projects → Education → Achievements',
    component: SoftwareEngineerTemplate,
    sectionHierarchy: ['Contact', 'Summary', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'swe-resume',
    name: 'SWE Resume Template',
    role: 'Full Stack Engineer',
    category: 'Software / IT',
    description: 'Compact ATS-oriented structure emphasizing full-stack proficiency, React, Node.js, databases, and high-impact metrics.',
    bestFor: 'Software Engineer / Full Stack Developer',
    tag: 'Full Stack SWE',
    structureNote: 'Header → Skills (Top) → Experience → Projects → Education → Achievements',
    component: SWEResumeTemplate,
    sectionHierarchy: ['Header', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'faangpath-simple',
    name: 'FAANGPath Simple Template',
    role: 'SDE / Tech Specialist',
    category: 'Software / IT',
    description: 'High-density, minimal styling with clear section hierarchy engineered for high-bar technical screening systems.',
    bestFor: 'SDE / FAANG / New Grad',
    tag: 'FAANGPath',
    structureNote: 'Header → Education → Technical Skills → Experience → Projects → Achievements',
    component: FAANGPathTemplate,
    sectionHierarchy: ['Header', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Achievements'],
  },
  {
    id: 'cs-it-swe',
    name: 'CS/IT/SWE Resume Template',
    role: 'Computer Science & IT Developer',
    category: 'Engineering',
    description: 'Technical competencies prioritized at the very top, followed by academic background, engineering experience, and projects.',
    bestFor: 'CS / IT / Software Developer',
    tag: 'CS / IT Standard',
    structureNote: 'Technical Skills (Top) → Education → Experience → Projects → Certifications / Achievements',
    component: CSITSweTemplate,
    sectionHierarchy: ['Technical Skills', 'Education', 'Experience', 'Projects', 'Certifications / Achievements'],
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering Resume',
    role: 'Software Engineer / Systems Developer',
    category: 'Engineering',
    description: 'Structured layout emphasizing engineering fundamentals, backend microservices, databases, and architectural delivery.',
    bestFor: 'Software Engineer / Systems Developer',
    tag: 'Systems Eng.',
    structureNote: 'Header → Summary → Experience → Technical Skills → Projects → Education → Achievements',
    component: SoftwareEngineeringResumeTemplate,
    sectionHierarchy: ['Header', 'Summary', 'Experience', 'Technical Skills', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'resume-professional-swe',
    name: 'Resume Professional Template — Software Engineer',
    role: 'Experienced Software Engineer',
    category: 'Engineering',
    description: 'Authoritative engineering hierarchy with experience as the dominant section, production ownership, and technical leadership.',
    bestFor: 'Experienced Software Engineer',
    tag: 'Professional SWE',
    structureNote: 'Header → Summary → Experience (Dominant) → Skills → Projects → Education → Achievements',
    component: ResumeProfessionalSWETemplate,
    sectionHierarchy: ['Header', 'Summary', 'Experience', 'Skills', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'undergraduate-cv',
    name: 'Undergraduate CV Template',
    role: 'Student / Fresher / Internship',
    category: 'Student',
    description: 'Academic-first CV template for undergraduates and freshers highlighting coursework, CGPA, projects, hackathons, and leadership.',
    bestFor: 'Student / Fresher / Internship',
    tag: 'Undergraduate CV',
    structureNote: 'Education (Top) → Technical Skills → Projects → Experience → Achievements → Leadership',
    component: UndergraduateCVTemplate,
    sectionHierarchy: ['Education', 'Technical Skills', 'Projects', 'Experience', 'Achievements', 'Leadership'],
  },
  {
    id: 'modern-simple-cv',
    name: 'Modern Simple CV',
    role: 'Frontend Developer / UI Developer',
    category: 'General',
    description: 'Refined modern header and typography with clear focus on React, TypeScript, UI engineering, and responsive web platforms.',
    bestFor: 'Frontend Developer / UI Developer',
    tag: 'Frontend / UI',
    structureNote: 'Header → Summary → Skills → Experience → Projects → Education → Achievements',
    component: ModernSimpleCVTemplate,
    sectionHierarchy: ['Header', 'Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'resume-cv',
    name: 'Resume / CV',
    role: 'General Technology / Graduate',
    category: 'General',
    description: 'Balanced, flexible single-page structure suitable for diverse engineering, software developer, and technical roles.',
    bestFor: 'General Professional / Graduate',
    tag: 'General CV',
    structureNote: 'Header → Summary → Skills → Experience → Projects → Education → Achievements',
    component: ResumeCVTemplate,
    sectionHierarchy: ['Header', 'Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
];

export function getTemplateById(id: TemplateType | string): TemplateDefinition {
  const normalized = normalizeTemplateId(id);
  const found = TEMPLATES.find((t) => t.id === normalized);
  return found || TEMPLATES[0];
}
