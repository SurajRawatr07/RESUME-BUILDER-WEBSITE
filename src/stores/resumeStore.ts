import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, TemplateType } from '../types/resume';

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
  aboutMe: 'Passionate software engineer with 5+ years of experience building scalable web applications.',
  summary: 'Results-driven software engineer with expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering high-quality products and mentoring junior developers.',
  experiences: [
    {
      id: '1',
      jobTitle: ' Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Haldwani, India',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead development of microservices architecture serving 2M+ users. Reduced API response time by 40% through optimization. Mentor team of 5 junior engineers.',
    },
    {
      id: '2',
      jobTitle: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Haldwani, India',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Built and maintained React-based dashboard application. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with cross-functional teams.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of India',
      location: 'Haldwani, India',
      graduationDate: '2019-05',
      gpa: '3.8',
      description: 'Focused on software engineering, algorithms, and distributed systems.',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      technologies: 'React, Node.js, PostgreSQL, AWS',
      startDate: '2023-01',
      endDate: '2023-06',
      description: 'Built full-stack e-commerce platform with payment integration, inventory management, and admin dashboard. Processed 10K+ transactions.',
      link: 'github.com/john/ecommerce',
    },
    {
      id: '2',
      title: 'AI Content Generator',
      technologies: 'Python, FastAPI, OpenAI API, React',
      startDate: '2023-08',
      endDate: '2023-12',
      description: 'Developed AI-powered content generation tool for marketing teams. Integrated GPT-4 API with custom prompts.',
    },
  ],
  skills: ['Leadership', 'Problem Solving', 'Communication', 'Project Management'],
  technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB'],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-09',
      link: 'aws.amazon.com/certification',
    },
  ],
  achievements: [
    'Employee of the Year 2023 - Tech Solutions Inc.',
    'Published 3 technical articles with 50K+ combined views',
    'Speaker at TechConf 2023 on Microservices Architecture',
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Professional' },
  ],
  interests: ['Open Source Contribution', 'Technical Writing', 'Hiking', 'Photography'],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: initialResumeData,
      selectedTemplate: 'modern',
      setResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      setSelectedTemplate: (template) =>
        set({ selectedTemplate: template }),
      resetResume: () =>
        set({ resumeData: initialResumeData, selectedTemplate: 'modern' }),
    }),
    {
      name: 'resume-storage',
    }
  )
);
