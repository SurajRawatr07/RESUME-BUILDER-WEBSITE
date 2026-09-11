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

export default function ResumeCVTemplate({ data }: TemplateProps) {
  const hasTech = data.technologies && data.technologies.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const summaryText = data.summary || data.aboutMe;

  return (
    <div
      className="w-full bg-white text-gray-900 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#111827',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. PROFESSIONAL OVERLEAF CV HEADER */}
      <ResumeHeader data={data} variant="latex" />

      {/* 2. PROFESSIONAL SUMMARY (If provided) */}
      {summaryText && (
        <ResumeSection title="Professional Summary" variant="latex">
          <p className="text-xs sm:text-[13px] leading-relaxed text-gray-800 text-justify">
            {summaryText}
          </p>
        </ResumeSection>
      )}

      {/* 3. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Experience" variant="latex">
          <ExperienceSection experiences={data.experiences} variant="latex" />
        </ResumeSection>
      )}

      {/* 4. SKILLS & COMPETENCIES */}
      {(hasTech || hasSkills) && (
        <ResumeSection title="Skills & Competencies" variant="latex">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="latex"
          />
        </ResumeSection>
      )}

      {/* 5. RELEVANT PROJECTS & WORK */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Projects & Notable Work" variant="latex">
          <ProjectsSection projects={data.projects} variant="latex" />
        </ResumeSection>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="latex">
          <EducationSection education={data.education} variant="latex" />
        </ResumeSection>
      )}

      {/* 7. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="latex"
        />
      )}

      {/* 8. ACHIEVEMENTS / HONORS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="latex"
          title="Honors & Achievements"
        />
      )}

      {/* 9. LANGUAGES & ADDITIONAL INFO */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="latex" />
      )}
    </div>
  );
}
