import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, TemplateType, normalizeTemplateId } from '../types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  setResumeData: (data: Partial<ResumeData>) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  resetResume: () => void;
}

const initialResumeData: ResumeData = {
  fullName: 'Suraj Rawat',
  jobTitle: 'Software Engineer',
  email: 'rawatsuraj80627@email.com',
  phone: '+91 9675218790',
  location: 'Haldwani, India',
  linkedin: 'linkedin.com/in/suraj-rawat-30513b340',
  github: 'github.com/SurajRawatr07',
  portfolio: 'resume-craft-07.vercel.app',
  aboutMe: 'Software engineer experienced in full-stack web applications, scalable backend microservices, and modern UI engineering.',
  summary: 'Results-oriented Software Engineer with strong experience across modern JavaScript/TypeScript, React, Node.js, and cloud systems. Proven background designing high-throughput services, optimizing database query latency, and delivering ATS-compliant applications with high attention to detail.',
  experiences: [
    {
      id: '1',
      jobTitle: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Noida, India',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Architected and scaled distributed microservices handling 2.5M+ requests daily, improving system availability to 99.98%.\n• Optimized critical PostgreSQL indexes and Redis caching strategies, reducing p99 API response latencies by 42%.\n• Spearheaded the automated CI/CD deployment pipeline with Docker and GitHub Actions, slashing release cycle times from 4 hours to 18 minutes.\n• Mentored 5 associate engineers across clean code principles, test-driven development, and modular architectural design.',
    },
    {
      id: '2',
      jobTitle: 'Software Developer',
      company: 'StartupXYZ',
      location: 'Bengaluru, India',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: '• Built responsive, accessible analytics dashboard in React & TypeScript adopted by 45,000+ monthly active business users.\n• Implemented secure JWT authentication and role-based access control (RBAC) across 30+ internal administrative endpoints.\n• Collaborated cross-functionally with product managers and UX designers to reduce customer onboarding friction by 28%.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      institution: 'Uttarakhand Technical University',
      location: 'Dehradun, India',
      graduationDate: '2019-05',
      gpa: '8.6/10.0 (Top 5% of graduating class)',
      description: 'Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Distributed Systems, Computer Networks.',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'High-Throughput E-Commerce Platform',
      technologies: 'React, Node.js, PostgreSQL, Redis, Stripe API, Docker',
      startDate: '2023-01',
      endDate: '2023-06',
      description: '• Built full-stack transactional platform with real-time inventory locking, resilient webhooks, and analytics portal.\n• Handled 10,000+ concurrent simulated checkouts with sub-100ms response times and zero double-charge anomalies.\n• Integrated automated PDF receipt generation and real-time webhook status notifications.',
      link: 'github.com/SurajRawatr07/ecommerce-core',
    },
    {
      id: '2',
      title: 'AI Resume & Document Intelligence Platform',
      technologies: 'TypeScript, Python, FastAPI, React, Tailwind CSS, Overleaf LaTeX Engine',
      startDate: '2023-08',
      endDate: '2023-12',
      description: '• Developed document parsing engine extracting structured JSON entities from multi-page PDFs with 94% precision.\n• Designed 9 recruiter-vetted LaTeX-style professional resume layouts with automated ATS readability auditing.\n• Optimized client-side vector rendering to ensure 60fps scrolling and print-perfect A4 dimensioning.',
      link: 'github.com/SurajRawatr07/resume-craft',
    },
  ],
  skills: [
    'System Design & Microservices',
    'RESTful & GraphQL API Architecture',
    'Database Optimization & Indexing',
    'Agile / Scrum Sprint Leadership',
    'Cross-Functional Collaboration',
  ],
  technologies: [
    'TypeScript',
    'JavaScript (ES6+)',
    'React',
    'Node.js',
    'Express',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'AWS (S3, EC2)',
    'Git',
    'Tailwind CSS',
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      date: '2022-09',
      link: 'aws.amazon.com/verification',
    },
    {
      id: '2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta',
      date: '2021-11',
      link: 'coursera.org/verify',
    },
  ],
  achievements: [
    'Won 1st place in National Open-Source Hackathon among 120+ collegiate and industry teams.',
    'Published 4 technical engineering articles on distributed cache invalidation with 60,000+ views.',
    'Awarded "Excellence in Engineering" Q3 2023 at Tech Solutions Inc. for reducing server infrastructure costs by $14,000/year.',
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Professional' },
    { id: '2', language: 'Hindi', proficiency: 'Native' },
  ],
  interests: ['Distributed Systems', 'Open Source Tooling', 'LaTeX Typesetting', 'Technical Blogging'],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      selectedTemplate: 'software-engineer',
      setResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      setSelectedTemplate: (template) =>
        set({ selectedTemplate: normalizeTemplateId(template) }),
      resetResume: () =>
        set({ resumeData: initialResumeData, selectedTemplate: 'software-engineer' }),
    }),
    {
      name: 'resume-storage',
      // Migrate legacy template names automatically
      onRehydrateStorage: () => (state) => {
        if (state && state.selectedTemplate) {
          state.selectedTemplate = normalizeTemplateId(state.selectedTemplate);
        }
      },
    }
  )
);
