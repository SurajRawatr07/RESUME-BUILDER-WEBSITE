import React from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeHeader } from './common/ResumeHeader';
import { ResumeSection } from './common/ResumeSection';
import { ExperienceSection } from './common/ExperienceSection';
import { EducationSection } from './common/EducationSection';
import { ProjectsSection } from './common/ProjectsSection';
import { SkillsSection } from './common/SkillsSection';
import {
  SummarySection,
  CertificationsSection,
  AchievementsSection,
  LanguagesSection,
} from './common/AdditionalSections';

interface TemplateProps {
  data: ResumeData;
}

export default function CreativeGeneralTemplate({ data }: TemplateProps) {
  const hasTech = data.technologies && data.technologies.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;

  return (
    <div
      className="w-full bg-white text-gray-950 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#18181b',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. TYPOGRAPHIC PROFESSIONAL HEADER */}
      <ResumeHeader data={data} variant="designer" />

      {/* 2. CAREER SUMMARY */}
      {data.summary && (
        <SummarySection
          summary={data.summary}
          variant="designer"
          title="Professional Summary"
        />
      )}

      {/* 3. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Professional Experience" variant="designer">
          <ExperienceSection experiences={data.experiences} variant="designer" />
        </ResumeSection>
      )}

      {/* 4. KEY SKILLS & COMPETENCIES */}
      {(hasTech || hasSkills) && (
        <ResumeSection title="Core Competencies & Tools" variant="designer">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="designer"
          />
        </ResumeSection>
      )}

      {/* 5. KEY PROJECTS & INITIATIVES */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Key Projects & Initiatives" variant="designer">
          <ProjectsSection projects={data.projects} variant="designer" />
        </ResumeSection>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="designer">
          <EducationSection education={data.education} variant="designer" />
        </ResumeSection>
      )}

      {/* 7. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="designer"
        />
      )}

      {/* 8. ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="designer"
          title="Selected Achievements"
        />
      )}

      {/* 9. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="designer" />
      )}
    </div>
  );
}
