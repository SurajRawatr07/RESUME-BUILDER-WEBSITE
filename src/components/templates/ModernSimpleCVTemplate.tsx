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

export default function ModernSimpleCVTemplate({ data }: TemplateProps) {
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
      {/* 1. CLEAN MODERN MINIMAL HEADER */}
      <ResumeHeader data={data} variant="minimal" />

      {/* 2. SUMMARY (If provided) */}
      {summaryText && (
        <ResumeSection title="Summary" variant="minimal">
          <p className="text-xs sm:text-[13px] leading-relaxed text-gray-700 text-justify">
            {summaryText}
          </p>
        </ResumeSection>
      )}

      {/* 3. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Experience" variant="minimal">
          <ExperienceSection experiences={data.experiences} variant="minimal" />
        </ResumeSection>
      )}

      {/* 4. SKILLS */}
      {(hasTech || hasSkills) && (
        <ResumeSection title="Skills & Competencies" variant="minimal">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="minimal"
          />
        </ResumeSection>
      )}

      {/* 5. PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Projects" variant="minimal">
          <ProjectsSection projects={data.projects} variant="minimal" />
        </ResumeSection>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="minimal">
          <EducationSection education={data.education} variant="minimal" />
        </ResumeSection>
      )}

      {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="minimal"
        />
      )}

      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="minimal"
          title="Achievements"
        />
      )}

      {/* 8. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="minimal" />
      )}
    </div>
  );
}
