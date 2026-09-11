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

export default function FAANGPathTemplate({ data }: TemplateProps) {
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
      {/* 1. FAANGPATH CENTERED COMPACT HEADER */}
      <ResumeHeader data={data} variant="faangpath" />

      {/* 2. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="faangpath">
          <EducationSection education={data.education} variant="faangpath" />
        </ResumeSection>
      )}

      {/* 3. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Experience" variant="faangpath">
          <ExperienceSection experiences={data.experiences} variant="faangpath" />
        </ResumeSection>
      )}

      {/* 4. PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Projects" variant="faangpath">
          <ProjectsSection projects={data.projects} variant="faangpath" />
        </ResumeSection>
      )}

      {/* 5. TECHNICAL SKILLS */}
      {(hasTech || hasSkills) && (
        <ResumeSection title="Technical Skills" variant="faangpath">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="faangpath"
          />
        </ResumeSection>
      )}

      {/* 6. ACHIEVEMENTS & LEADERSHIP */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="faangpath"
          title="Leadership & Extracurricular"
        />
      )}

      {/* 7. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="faangpath"
        />
      )}

      {/* 8. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="faangpath" />
      )}
    </div>
  );
}
