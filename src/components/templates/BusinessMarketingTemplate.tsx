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

export default function BusinessMarketingTemplate({ data }: TemplateProps) {
  const tech = data.technologies || [];
  const skills = data.skills || [];

  const categories = [];
  if (skills.length > 0) {
    categories.push({ label: 'Marketing & Business Strategy', items: skills });
  }
  if (tech.length > 0) {
    categories.push({ label: 'Platforms, Analytics & Tools', items: tech });
  }

  return (
    <div
      className="w-full bg-white text-gray-900 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#111827',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. PROFESSIONAL CORPORATE HEADER */}
      <ResumeHeader data={data} variant="executive" />

      {/* 2. EXECUTIVE SUMMARY (Business Impact & Revenue Growth) */}
      {data.summary && (
        <SummarySection
          summary={data.summary}
          variant="executive"
          title="Executive Profile"
        />
      )}

      {/* 3. PROFESSIONAL EXPERIENCE (Campaigns, Growth, ROI, Team Leadership) */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Professional Experience" variant="executive">
          <ExperienceSection experiences={data.experiences} variant="executive" />
        </ResumeSection>
      )}

      {/* 4. KEY ACHIEVEMENTS & REVENUE WINS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="executive"
          title="Quantified Business Achievements"
        />
      )}

      {/* 5. STRATEGIC CAMPAIGNS & INITIATIVES */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Key Campaigns & Initiatives" variant="executive">
          <ProjectsSection projects={data.projects} variant="executive" />
        </ResumeSection>
      )}

      {/* 6. CORE COMPETENCIES & TOOLING */}
      {(skills.length > 0 || tech.length > 0) && (
        <ResumeSection title="Core Competencies & Platforms" variant="executive">
          {categories.length > 0 ? (
            <SkillsSection categories={categories} variant="executive" />
          ) : (
            <SkillsSection
              skills={data.skills}
              technologies={data.technologies}
              variant="executive"
            />
          )}
        </ResumeSection>
      )}

      {/* 7. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="executive">
          <EducationSection education={data.education} variant="executive" />
        </ResumeSection>
      )}

      {/* 8. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="executive"
        />
      )}

      {/* 9. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="executive" />
      )}
    </div>
  );
}
