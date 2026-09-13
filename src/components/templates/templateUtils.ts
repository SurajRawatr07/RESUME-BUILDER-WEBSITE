import { ResumeData } from '@/types/resume';

export interface CategorizedSkills {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
  coreCS: string[];
  ai: string[];
  other: string[];
}

export function categorizeSkills(data: ResumeData): CategorizedSkills {
  const all = [...(data.technologies || []), ...(data.skills || [])];
  const unique = Array.from(new Set(all.map((s) => s.trim()).filter(Boolean)));

  const result: CategorizedSkills = {
    languages: [],
    frontend: [],
    backend: [],
    databases: [],
    tools: [],
    coreCS: [],
    ai: [],
    other: [],
  };

  const langTerms = ['c++', 'c#', 'java', 'python', 'javascript', 'typescript', 'sql', 'html', 'css', 'c', 'rust', 'go', 'php', 'ruby', 'kotlin', 'swift'];
  const feTerms = ['react', 'next', 'tailwind', 'vue', 'angular', 'redux', 'zustand', 'react native', 'react query', 'html5', 'css3', 'sass', 'bootstrap', 'ui', 'ux'];
  const beTerms = ['node', 'express', 'rest api', 'jwt', 'websocket', 'django', 'flask', 'spring', 'fastapi', 'graphql', 'auth', 'middleware', 'microservice'];
  const dbTerms = ['mongo', 'postgres', 'mysql', 'sql', 'redis', 'mongoose', 'prisma', 'database', 'schema', 'crud', 'dynamodb'];
  const toolTerms = ['git', 'github', 'docker', 'aws', 'ci/cd', 'postman', 'vercel', 'netlify', 'linux', 'kubernetes', 'testing', 'debugging', 'deployment', 'vite'];
  const csTerms = ['data structure', 'dsa', 'algorithm', 'oop', 'dbms', 'operating system', 'network', 'system design', 'computer network'];
  const aiTerms = ['generative ai', 'llm', 'rag', 'prompt engineering', 'openai', 'machine learning', 'deep learning'];

  unique.forEach((item) => {
    const lower = item.toLowerCase();
    if (csTerms.some((t) => lower.includes(t))) {
      result.coreCS.push(item);
    } else if (aiTerms.some((t) => lower.includes(t))) {
      result.ai.push(item);
    } else if (langTerms.some((t) => lower === t || lower.startsWith(t + ' '))) {
      result.languages.push(item);
    } else if (feTerms.some((t) => lower.includes(t))) {
      result.frontend.push(item);
    } else if (beTerms.some((t) => lower.includes(t))) {
      result.backend.push(item);
    } else if (dbTerms.some((t) => lower.includes(t))) {
      result.databases.push(item);
    } else if (toolTerms.some((t) => lower.includes(t))) {
      result.tools.push(item);
    } else {
      result.other.push(item);
    }
  });

  return result;
}

export function parseBullets(text?: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim().replace(/^[•\-*]\s*/, ''))
    .filter((line) => line.length > 0);
}

export function cleanUrl(url?: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

export function ensureHttp(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getContactHref(
  type: 'email' | 'phone' | 'github' | 'linkedin' | 'portfolio' | 'leetcode' | 'website',
  value?: string
): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (type === 'email') return `mailto:${trimmed}`;
  if (type === 'phone') return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
  if (type === 'github') {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('github.com/')) return `https://${trimmed}`;
    return `https://github.com/${trimmed}`;
  }
  if (type === 'linkedin') {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('linkedin.com/')) return `https://${trimmed}`;
    return `https://linkedin.com/in/${trimmed}`;
  }
  if (type === 'leetcode') {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('leetcode.com/')) return `https://${trimmed}`;
    return `https://leetcode.com/u/${trimmed}`;
  }
  return ensureHttp(trimmed);
}

export function formatContactLabel(
  type: 'email' | 'phone' | 'github' | 'linkedin' | 'portfolio' | 'leetcode' | 'website',
  value?: string
): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (type === 'email' || type === 'phone') return trimmed;
  return cleanUrl(trimmed);
}
