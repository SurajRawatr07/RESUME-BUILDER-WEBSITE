import React from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeHeader } from './common/ResumeHeader';
import { ResumeSection } from './common/ResumeSection';
import { ExperienceSection } from './common/ExperienceSection';
import { EducationSection } from './common/EducationSection';
import { ProjectsSection } from './common/ProjectsSection';
import { SkillsSection } from './common/SkillsSection';
import {
  CertificationsSection,
  AchievementsSection,
  LanguagesSection,
} from './common/AdditionalSections';

interface TemplateProps {
  data: ResumeData;
}

export default function UndergraduateCVTemplate({ data }: TemplateProps) {
  const hasTech = data.technologies && data.technologies.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;

  return (
    <div
      className="w-full bg-white text-gray-900 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#111827',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. ACADEMIC / OVERLEAF HEADER */}
      <ResumeHeader data={data} variant="latex" />

      {/* 2. EDUCATION AT TOP (Academic priority for undergraduates) */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="latex">
          <EducationSection education={data.education} variant="latex" />
        </ResumeSection>
      )}

      {/* 3. TECHNICAL SKILLS & COURSEWORK */}
      {(hasTech || hasSkills) && (
        <ResumeSection title="Technical Skills & Coursework" variant="latex">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="latex"
          />
        </ResumeSection>
      )}

      {/* 4. ACADEMIC & TECHNICAL PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Projects" variant="latex">
          <ProjectsSection projects={data.projects} variant="latex" />
        </ResumeSection>
      )}

      {/* 5. EXPERIENCE & INTERNSHIPS (If provided) */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Experience & Internships" variant="latex">
          <ExperienceSection experiences={data.experiences} variant="latex" />
        </ResumeSection>
      )}

      {/* 6. PUBLICATIONS / RESEARCH (If present) */}
      {data.publications && data.publications.length > 0 && (
        <ResumeSection title="Publications & Research" variant="latex">
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-800">
            {data.publications.map((pub, idx) => (
              <li key={idx} className="leading-relaxed">{pub}</li>
            ))}
          </ul>
        </ResumeSection>
      )}

      {/* 7. HONORS, AWARDS & HACKATHONS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="latex"
          title="Honors, Hackathons & Awards"
        />
      )}

      {/* 8. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="latex"
          title="Certifications & Training"
        />
      )}

      {/* 9. LANGUAGES & ACTIVITIES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="latex" />
      )}
    </div>
  );
}
