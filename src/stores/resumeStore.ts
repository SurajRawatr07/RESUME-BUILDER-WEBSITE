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
  email: 'rawatsuraj80627@gmail.com',
  phone: '+91 96752 19087',
  location: 'Haldwani, Uttarakhand, India',
  github: 'github.com/SurajRawatr07',
  linkedin: 'linkedin.com/in/suraj-rawat-30513b340',
  leetcode: 'leetcode.com/u/surajrawat',
  portfolio: 'resume-craft-07.vercel.app',
  aboutMe: 'Software Engineer and BCA student with hands-on experience in full-stack development, backend engineering, REST APIs, and databases. Strong foundation in Data Structures & Algorithms, OOP, DBMS, Operating Systems, and Computer Networks.',
  summary: 'Software Engineer and BCA student with hands-on experience in full-stack development, backend engineering, REST APIs, and databases. Strong foundation in Data Structures & Algorithms, OOP, DBMS, Operating Systems, and Computer Networks. Experienced with React, TypeScript, Node.js, Express.js, MongoDB, PostgreSQL, authentication, API integration, testing, debugging, and deployment.',
  education: [
    {
      id: '1',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Graphic Era Hill University',
      location: 'Haldwani, Uttarakhand, India',
      graduationDate: '2024–2027',
      gpa: '8.0/10 CGPA',
      coursework: 'Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks',
      description: 'Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks. CGPA: 8.0/10.',
    },
  ],
  skills: [
    'Data Structures & Algorithms',
    'Object-Oriented Programming (OOP)',
    'Database Management Systems (DBMS)',
    'Operating Systems & Networks',
    'RESTful API Architecture',
    'Authentication & Authorization (JWT)',
    'Full-Stack Architecture',
    'Version Control & CI/CD',
  ],
  technologies: [
    'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'SQL',
    'React.js', 'Next.js', 'Tailwind CSS', 'React Native', 'Redux Toolkit', 'Zustand', 'React Query',
    'Node.js', 'Express.js', 'REST APIs', 'JWT', 'WebSockets', 'Authentication', 'Authorization', 'Middleware',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Mongoose', 'Database Design', 'Schema Design', 'CRUD',
    'Git', 'GitHub', 'Docker', 'AWS', 'CI/CD', 'Postman', 'Vercel', 'Netlify', 'Testing', 'Debugging', 'Deployment',
    'Generative AI', 'LLM Applications', 'RAG', 'Prompt Engineering', 'OpenAI API'
  ],
  experiences: [
    {
      id: '1',
      jobTitle: 'Web Development Intern',
      company: 'CodeAlpha — Cognifyz Technologies — Oasis Infobyte — SyntecxHub',
      location: 'Remote, India',
      startDate: '2026',
      endDate: '',
      current: true,
      description: '• Developed responsive and component-based web applications using React.js, JavaScript, HTML, CSS, and REST APIs.\n• Integrated APIs and improved application reliability through validation, debugging, testing, performance optimization, and Git/GitHub workflows.',
    },
    {
      id: '2',
      jobTitle: 'Freelance Full-Stack Developer',
      company: 'Self-Employed',
      location: 'Haldwani, India',
      startDate: '2024',
      endDate: '',
      current: true,
      description: '• Designed and deployed full-stack applications using React, TypeScript, Node.js, Express.js, and MongoDB.\n• Built REST APIs with JWT authentication, authorization, validation, database schemas, error handling, and modular backend architecture.\n• Managed feature development, API integration, debugging, testing, version control, deployment, and maintenance.',
    },
    {
      id: '3',
      jobTitle: 'Open-Source Contributor',
      company: 'Open Source Community',
      location: 'Global',
      startDate: '2024',
      endDate: '',
      current: true,
      description: '• Contributed through Git/GitHub, pull requests, issues, branching, debugging, documentation, code review, and collaborative development.\n• Participated in Elite Coder 2026.',
    },
    {
      id: '4',
      jobTitle: 'Founder & Community Lead',
      company: 'Tech Circle',
      location: 'Haldwani, India',
      startDate: '2026',
      endDate: '',
      current: true,
      description: '• Founded and lead a developer community focused on technical learning, internships, hackathons, networking, and developer collaboration, growing to 1300+ members.',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Resume Craft — AI Resume Platform',
      technologies: 'React, TypeScript, Tailwind CSS, Node.js',
      startDate: '2025',
      endDate: '2026',
      description: '• Built an AI-powered resume platform with dynamic forms, live preview, validation, ATS scoring, authentication, and responsive UI.\n• Developed 9 professional resume templates with reusable components, structured workflows, and client-side validation.',
      link: 'github.com/SurajRawatr07/resume-craft',
    },
    {
      id: '2',
      title: 'ONE IDE — Online Code Runner',
      technologies: 'React, Node.js, Express.js, MongoDB',
      startDate: '2024',
      endDate: '2025',
      description: '• Built a multi-language online code execution platform supporting code submission, compilation, execution, and real-time output.\n• Implemented REST APIs, request validation, error handling, database integration, and backend service workflows.',
      link: 'github.com/SurajRawatr07/one-ide',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'Elite Coder 2026 Participation & Certification',
      issuer: 'National Coding League',
      date: '2026',
      link: 'elitecoder.dev/verify',
    },
    {
      id: '2',
      name: 'Full-Stack Web Development & DSA Specialization',
      issuer: 'Graphic Era Hill University',
      date: '2025',
      link: 'gehu.ac.in',
    },
  ],
  achievements: [
    'LeetCode Top 29% with 1566 contest rating; solved 400+ DSA problems across Arrays, Strings, Trees, Graphs, and Dynamic Programming.',
    'Participated in 9+ hackathons, including 4 national-level hackathons.',
    'Built a 6,000+ LinkedIn audience through technical content, developer engagement, knowledge sharing, and community initiatives.',
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Professional' },
    { id: '2', language: 'Hindi', proficiency: 'Native' },
  ],
  interests: ['Data Structures & Algorithms', 'Open Source Development', 'System Design & REST APIs', 'Community Building'],
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
      name: 'resume-craft-storage-v2',
      // Migrate legacy template names automatically
      onRehydrateStorage: () => (state) => {
        if (state && state.selectedTemplate) {
          state.selectedTemplate = normalizeTemplateId(state.selectedTemplate);
        }
      },
    }
  )
);
