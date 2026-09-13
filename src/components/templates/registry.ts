import React from 'react';
import { ResumeData, TemplateType, normalizeTemplateId } from '@/types/resume';
import FrontendTemplate from './FrontendTemplate';
import BackendTemplate from './BackendTemplate';
import FullStackTemplate from './FullStackTemplate';
import SDETemplate from './SDETemplate';
import FAANGTemplate from './FAANGTemplate';
import CSITTemplate from './CSITTemplate';
import DevOpsTemplate from './DevOpsTemplate';
import DataPythonTemplate from './DataPythonTemplate';
import MobileTemplate from './MobileTemplate';
import FresherTemplate from './FresherTemplate';
import OpenSourceTemplate from './OpenSourceTemplate';
import UIFrontendTemplate from './UIFrontendTemplate';

export type TemplateCategory =
  | 'All'
  | 'Frontend & UI'
  | 'Backend & Cloud'
  | 'Full Stack & SDE'
  | 'Student & Fresher'
  | 'Data & Mobile';

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
  'Frontend & UI',
  'Backend & Cloud',
  'Full Stack & SDE',
  'Student & Fresher',
  'Data & Mobile',
];

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    role: 'Frontend Developer / React Engineer',
    category: 'Frontend & UI',
    description: 'Modern clean one-page format with left-aligned header, prominent frontend ecosystem, web vitals, and component architectures.',
    bestFor: 'Frontend Engineers, React / Next.js Developers, Web Specialists',
    tag: 'Frontend / React',
    structureNote: 'Header → Skills & Ecosystem (Top) → Experience → Key Projects → Education → Achievements',
    component: FrontendTemplate,
    sectionHierarchy: ['Header', 'Frontend Ecosystem', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    role: 'Backend Developer / API Engineer',
    category: 'Backend & Cloud',
    description: 'Technical, structured layout with double-ruled header, emphasizing REST/GraphQL APIs, microservices, databases, and low latency.',
    bestFor: 'Backend Engineers, API Architects, Database Engineers',
    tag: 'Backend / APIs',
    structureNote: 'Centered Header → Competencies → Experience (Dominant) → Systems Projects → Education',
    component: BackendTemplate,
    sectionHierarchy: ['Header', 'Competencies', 'Work Experience', 'Systems Projects', 'Education'],
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    role: 'Full Stack Engineer / MERN Specialist',
    category: 'Full Stack & SDE',
    description: 'Balanced full-stack structure with 4-quadrant skill matrix, end-to-end web platforms, and complete product delivery.',
    bestFor: 'Full Stack Developers, MERN / Next.js Engineers, Product Engineers',
    tag: 'Full Stack',
    structureNote: 'Header → Full Stack Matrix → Work Experience → Full-Stack Projects → Education',
    component: FullStackTemplate,
    sectionHierarchy: ['Header', 'Full Stack Stack', 'Experience', 'End-to-End Projects', 'Education'],
  },
  {
    id: 'sde',
    name: 'Software Engineer / SDE',
    role: 'Software Development Engineer',
    category: 'Full Stack & SDE',
    description: 'Classic Overleaf SWE 1-column layout with compact pipe contact row, balanced section weights, and clean algorithmic bullets.',
    bestFor: 'SDEs, Software Engineers, Generalist Developers',
    tag: 'Overleaf Classic',
    structureNote: 'Centered Name → Education → Experience → Technical Projects → Skills',
    component: SDETemplate,
    sectionHierarchy: ['Contact Header', 'Education', 'Experience', 'Projects', 'Technical Skills'],
  },
  {
    id: 'faang',
    name: 'FAANG / Big Tech',
    role: 'FAANG / Tier-1 Software Engineer',
    category: 'Full Stack & SDE',
    description: 'Ultra-dense recruiter-scanning layout with zero fluff, quantitative bullet points, distributed systems, and competitive programming.',
    bestFor: 'FAANG Applicants, High-Growth Tech, LeetCode / ICPC Competitors',
    tag: 'FAANG / Big Tech',
    structureNote: 'Compact Header → Technical Skills → Experience → Projects → Education → Honors',
    component: FAANGTemplate,
    sectionHierarchy: ['Header', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Honors'],
  },
  {
    id: 'cs-it',
    name: 'Computer Science / IT',
    role: 'CS & IT Software Engineer',
    category: 'Student & Fresher',
    description: 'Rigorous engineering layout prioritizing academic foundations, Core CS coursework (DSA, OS, DBMS, Networks), and lab projects.',
    bestFor: 'B.Tech / BCA / CS / IT Graduates, Computer Science Engineers',
    tag: 'CS / IT Core',
    structureNote: 'Header → Education & Coursework → Technical Competencies → Projects → Experience',
    component: CSITTemplate,
    sectionHierarchy: ['Header', 'Education & Coursework', 'Competencies', 'Projects', 'Experience'],
  },
  {
    id: 'devops',
    name: 'DevOps / Cloud Engineer',
    role: 'DevOps & Cloud Infrastructure Engineer',
    category: 'Backend & Cloud',
    description: 'Infrastructure and systems engineering layout emphasizing AWS, Kubernetes, Terraform IaC, CI/CD pipelines, and 99.99% uptime.',
    bestFor: 'DevOps Engineers, SREs, Cloud Architects, Platform Engineers',
    tag: 'DevOps / Cloud',
    structureNote: 'Header → Infrastructure & Tooling → Experience → Automation Projects → Certifications',
    component: DevOpsTemplate,
    sectionHierarchy: ['Header', 'Infrastructure & Tools', 'Experience', 'Projects', 'Certifications'],
  },
  {
    id: 'data-python',
    name: 'Data / Python Developer',
    role: 'Data Engineer & Python Developer',
    category: 'Data & Mobile',
    description: 'Analytical layout focusing on Python, SQL, ETL data pipelines, Apache Spark, Airflow, and high-throughput data warehouses.',
    bestFor: 'Data Engineers, Python Developers, Data Platform Specialists',
    tag: 'Data / Python',
    structureNote: 'Centered Header → Competencies → Experience → Data Engineering Projects → Education',
    component: DataPythonTemplate,
    sectionHierarchy: ['Header', 'Data Competencies', 'Experience', 'Data Projects', 'Education'],
  },
  {
    id: 'mobile',
    name: 'Mobile App Developer',
    role: 'Mobile Developer (iOS & Android)',
    category: 'Data & Mobile',
    description: 'Mobile engineer hierarchy emphasizing React Native, native module bridging, offline synchronization, and App Store metrics.',
    bestFor: 'Mobile Engineers, React Native Developers, iOS/Android Developers',
    tag: 'Mobile / React Native',
    structureNote: 'Header → Mobile Stack → Experience → App Projects → Education → Achievements',
    component: MobileTemplate,
    sectionHierarchy: ['Header', 'Mobile Stack', 'Experience', 'App Projects', 'Education'],
  },
  {
    id: 'fresher',
    name: 'Student / Fresher',
    role: 'College Graduate / Intern',
    category: 'Student & Fresher',
    description: 'Academic & project-first CV for students and entry-level engineers with Education and CGPA at top, followed by hackathons and projects.',
    bestFor: 'College Students, Fresh Graduates, Entry-Level SWE, Interns',
    tag: 'Campus / Fresher',
    structureNote: 'Header → Education (Top) → Skills → Projects → Internships → Honors',
    component: FresherTemplate,
    sectionHierarchy: ['Header', 'Education', 'Technical Skills', 'Featured Projects', 'Internships', 'Honors'],
  },
  {
    id: 'opensource',
    name: 'Open Source Developer',
    role: 'Open Source Contributor & Maintainer',
    category: 'Full Stack & SDE',
    description: 'Open source maintainer layout featuring GitHub handles, published NPM packages, weekly download metrics, and merged PRs.',
    bestFor: 'Open Source Maintainers, Developer Advocates, Systems Tool Authors',
    tag: 'Open Source',
    structureNote: 'Header → Open Source Packages (Top) → Experience → Technical Stack → Education',
    component: OpenSourceTemplate,
    sectionHierarchy: ['Header', 'Open Source Projects', 'Experience', 'Technical Stack', 'Education'],
  },
  {
    id: 'ui-frontend',
    name: 'UI / Frontend Engineer',
    role: 'UI Engineer & Design Systems Specialist',
    category: 'Frontend & UI',
    description: 'Design systems and UI engineering layout highlighting component architectures, WCAG accessibility, micro-interactions, and Storybook.',
    bestFor: 'UI Engineers, Design System Specialists, Frontend Developers',
    tag: 'UI & Design Systems',
    structureNote: 'Header → UI Architecture & Systems → Experience → Design Systems → Education',
    component: UIFrontendTemplate,
    sectionHierarchy: ['Header', 'UI Systems', 'Experience', 'Component Projects', 'Education'],
  },
];

export function getTemplateById(id: TemplateType | string): TemplateDefinition {
  const normalized = normalizeTemplateId(id);
  const found = TEMPLATES.find((t) => t.id === normalized);
  return found || TEMPLATES[0];
}
