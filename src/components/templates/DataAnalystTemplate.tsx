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

export default function DataAnalystTemplate({ data }: TemplateProps) {
  // Analytical skills grouping helper
  const tech = data.technologies || [];
  const skills = data.skills || [];

  const programming = tech.filter((t) =>
    /python|r\b|sql|scala|bash|julia|sas/i.test(t)
  );
  const biAndViz = tech.filter((t) =>
    /tableau|power\s*bi|looker|matplotlib|seaborn|d3|excel|bi\b/i.test(t)
  );
  const modeling = skills.filter((s) =>
    /statistic|model|analys|forecast|regression|hypothesis|ab test|a\/b|machine learning/i.test(
      s
    )
  );
  const others = tech.filter(
    (t) => !programming.includes(t) && !biAndViz.includes(t)
  );

  const categories = [];
  if (programming.length > 0) {
    categories.push({ label: 'Languages & Querying', items: programming });
  }
  if (biAndViz.length > 0) {
    categories.push({ label: 'BI & Visualization', items: biAndViz });
  }
  if (modeling.length > 0) {
    categories.push({ label: 'Analytical & Statistical Methods', items: modeling });
  }
  if (others.length > 0) {
    categories.push({ label: 'Databases & Infrastructure', items: others });
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
      {/* 1. HEADER */}
      <ResumeHeader data={data} variant="latex" />

      {/* 2. PROFESSIONAL SUMMARY (Analytical Focus) */}
      {data.summary && (
        <SummarySection
          summary={data.summary}
          variant="latex"
          title="Professional Summary"
        />
      )}

      {/* 3. TECHNICAL & ANALYTICAL SKILLS */}
      {(tech.length > 0 || skills.length > 0) && (
        <ResumeSection title="Technical & Analytical Skills" variant="latex">
          {categories.length > 0 ? (
            <SkillsSection categories={categories} variant="latex" />
          ) : (
            <SkillsSection
              skills={data.skills}
              technologies={data.technologies}
              variant="latex"
            />
          )}
        </ResumeSection>
      )}

      {/* 4. PROFESSIONAL EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Professional Experience" variant="latex">
          <ExperienceSection experiences={data.experiences} variant="latex" />
        </ResumeSection>
      )}

      {/* 5. DATA & ANALYTICS PROJECTS (Problem -> Method -> Result) */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Data & Analytics Projects" variant="latex">
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

      {/* 8. ACHIEVEMENTS & PUBLICATIONS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="latex"
          title="Key Achievements & Publications"
        />
      )}

      {/* 9. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="latex" />
      )}
    </div>
  );
}
