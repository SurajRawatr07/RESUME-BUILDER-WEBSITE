import React from 'react';
import { ResumeData, TemplateType, normalizeTemplateId } from '@/types/resume';
import SoftwareEngineerTemplate from './SoftwareEngineerTemplate';
import DataAnalystTemplate from './DataAnalystTemplate';
import AIMLEngineerTemplate from './AIMLEngineerTemplate';
import UIUXDesignerTemplate from './UIUXDesignerTemplate';
import ProductManagerTemplate from './ProductManagerTemplate';
import BusinessMarketingTemplate from './BusinessMarketingTemplate';
import FinanceConsultingTemplate from './FinanceConsultingTemplate';
import StudentFresherTemplate from './StudentFresherTemplate';
import CreativeGeneralTemplate from './CreativeGeneralTemplate';

export type TemplateCategory =
  | 'All'
  | 'Tech'
  | 'Data & AI'
  | 'Design'
  | 'Product'
  | 'Business'
  | 'Finance'
  | 'Student'
  | 'Creative';

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
  'Tech',
  'Data & AI',
  'Design',
  'Product',
  'Business',
  'Finance',
  'Student',
  'Creative',
];

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    role: 'Software Engineer',
    category: 'Tech',
    description: 'ATS-optimized, high-density LaTeX single-column format modeled after standard Overleaf SWE engineering resumes.',
    bestFor: 'Software Engineer, Full-Stack, Backend, Frontend, SDE I/II/III',
    tag: 'ATS Standard',
    structureNote: 'Skills → Experience → Projects → Education → Certifications',
    component: SoftwareEngineerTemplate,
    sectionHierarchy: ['Contact & Links', 'Technical Skills', 'Experience', 'Projects', 'Education', 'Achievements'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst / Scientist',
    role: 'Data Analyst / Data Scientist',
    category: 'Data & AI',
    description: 'Structured analytical hierarchy highlighting querying (SQL), statistical modeling, data visualization, and quantifiable business impact.',
    bestFor: 'Data Analyst, Data Scientist, BI Engineer, Analytics Consultant',
    tag: 'Analytical',
    structureNote: 'Summary → Analytical Skills → Experience → Data Projects → Education',
    component: DataAnalystTemplate,
    sectionHierarchy: ['Summary', 'Analytical & BI Skills', 'Experience', 'Data/ML Projects', 'Education'],
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI / ML Engineer',
    role: 'AI / Machine Learning Engineer',
    category: 'Data & AI',
    description: 'Technical, research-grounded format prioritizing model architectures (LLMs, RAG, PyTorch), MLOps, datasets, benchmarks, and publications.',
    bestFor: 'ML Engineer, AI Researcher, Deep Learning Engineer, NLP/Computer Vision',
    tag: 'Research & ML',
    structureNote: 'Summary → AI/ML Skills → Experience/Research → Projects → Publications → Education',
    component: AIMLEngineerTemplate,
    sectionHierarchy: ['Technical Summary', 'AI/ML Competencies', 'Experience & Research', 'AI Projects', 'Publications', 'Education'],
  },
  {
    id: 'ui-ux-designer',
    name: 'UI / UX / Product Designer',
    role: 'UI / UX / Product Designer',
    category: 'Design',
    description: 'Refined typographic hierarchy with prominent portfolio visibility, design systems focus, UX process case studies, and tool proficiencies.',
    bestFor: 'Product Designer, UX/UI Designer, UX Researcher, Interaction Designer',
    tag: 'Design & UX',
    structureNote: 'Portfolio/Contact → Philosophy → Design Experience → Case Studies → Skills & Tools → Education',
    component: UIUXDesignerTemplate,
    sectionHierarchy: ['Portfolio Link', 'Design Philosophy', 'Experience', 'Case Studies', 'Skills & Tools', 'Education'],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    role: 'Product Manager',
    category: 'Product',
    description: 'Authoritative, executive layout emphasizing 0-to-1 product launches, growth metrics, revenue milestones, cross-functional leadership, and strategy.',
    bestFor: 'Product Manager, Group PM, Technical PM, Head of Product, Founder',
    tag: 'Executive',
    structureNote: 'Executive Summary → Product Experience → Achievements & Metrics → Core Competencies → Education',
    component: ProductManagerTemplate,
    sectionHierarchy: ['Executive Summary', 'Product Experience', 'Key Milestones', 'Initiatives', 'Competencies', 'Education'],
  },
  {
    id: 'business-marketing',
    name: 'Business / Marketing',
    role: 'Business / Marketing',
    category: 'Business',
    description: 'Commercial, campaign-focused document highlighting CAC/LTV improvements, revenue pipelines, growth marketing channels, and strategic wins.',
    bestFor: 'Growth Marketer, Business Development, Marketing Director, Sales Executive',
    tag: 'Business Impact',
    structureNote: 'Executive Profile → Experience → Quantified Achievements → Strategic Campaigns → Competencies',
    component: BusinessMarketingTemplate,
    sectionHierarchy: ['Executive Profile', 'Experience', 'Quantified Wins', 'Campaigns', 'Core Competencies', 'Education'],
  },
  {
    id: 'finance-consulting',
    name: 'Finance / Consulting',
    role: 'Finance / Consulting',
    category: 'Finance',
    description: 'Conservative Wall Street / Ivy League format with Education at top, classic serif typography, financial modeling focus, and zero decorative noise.',
    bestFor: 'Investment Banking, Management Consulting, Private Equity, Corporate Finance',
    tag: 'Wall St. Classic',
    structureNote: 'Education (Top) → Professional Experience → Engagements/Deals → Honors → Skills & Certifications',
    component: FinanceConsultingTemplate,
    sectionHierarchy: ['Education (Top)', 'Experience (Deals)', 'Engagements', 'Honors & Awards', 'Skills & CFA'],
  },
  {
    id: 'student-fresher',
    name: 'Student / Fresher',
    role: 'Student / Fresher',
    category: 'Student',
    description: 'Balanced academic and project-first layout designed to highlight coursework, CGPA, hackathons, and technical projects without looking empty.',
    bestFor: 'College Students, Recent Grads, Tech Interns, Entry-Level Candidates',
    tag: 'Academic First',
    structureNote: 'Education (Top) → Skills & Coursework → Academic Projects → Internships → Hackathons & Honors',
    component: StudentFresherTemplate,
    sectionHierarchy: ['Education (Top)', 'Technical Skills', 'Academic Projects', 'Internships', 'Hackathons & Awards'],
  },
  {
    id: 'creative-general',
    name: 'Creative / General Professional',
    role: 'Creative / General Professional',
    category: 'Creative',
    description: 'Versatile typographic document with clean editorial layout suited for Operations, HR, Media, Communications, and General Corporate leadership.',
    bestFor: 'HR, Operations, Communications, Media, Corporate Leadership, Content',
    tag: 'Versatile',
    structureNote: 'Summary → Experience → Core Competencies → Key Projects → Education → Additional Info',
    component: CreativeGeneralTemplate,
    sectionHierarchy: ['Summary', 'Experience', 'Competencies & Tools', 'Key Projects', 'Education', 'Achievements'],
  },
];

export function getTemplateById(id: TemplateType | string): TemplateDefinition {
  const normalized = normalizeTemplateId(id);
  const found = TEMPLATES.find((t) => t.id === normalized);
  return found || TEMPLATES[0];
}
