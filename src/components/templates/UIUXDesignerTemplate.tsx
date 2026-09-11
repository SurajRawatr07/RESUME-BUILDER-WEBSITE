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

export default function UIUXDesignerTemplate({ data }: TemplateProps) {
  const tech = data.technologies || [];
  const skills = data.skills || [];

  const designTools = tech.filter((t) =>
    /figma|sketch|adobe|illustrator|photoshop|framer|protopie|after effects|invision|miro/i.test(
      t
    )
  );
  const designSkills = skills.filter((s) =>
    /ux|ui|wirefram|prototyp|research|usability|design system|journey map|persona|information architecture/i.test(
      s
    )
  );

  const categories = [];
  if (designSkills.length > 0) {
    categories.push({ label: 'UX & Design Methodologies', items: designSkills });
  } else if (skills.length > 0) {
    categories.push({ label: 'Core Design Skills', items: skills });
  }

  if (designTools.length > 0) {
    categories.push({ label: 'Tools & Platforms', items: designTools });
  } else if (tech.length > 0) {
    categories.push({ label: 'Tools & Technologies', items: tech });
  }

  return (
    <div
      className="w-full bg-white text-gray-950 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#18181b',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. ELEGANT DESIGNER HEADER (Prominent Portfolio & Clean Contact) */}
      <ResumeHeader data={data} variant="designer" />

      {/* 2. DESIGN PHILOSOPHY & SUMMARY */}
      {data.summary && (
        <SummarySection
          summary={data.summary}
          variant="designer"
          title="Design Philosophy & Impact"
        />
      )}

      {/* 3. SELECTED DESIGN EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Design Experience" variant="designer">
          <ExperienceSection experiences={data.experiences} variant="designer" />
        </ResumeSection>
      )}

      {/* 4. CASE STUDIES & SELECTED PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Case Studies & Projects" variant="designer">
          <ProjectsSection projects={data.projects} variant="designer" />
        </ResumeSection>
      )}

      {/* 5. DESIGN SKILLS & TOOLS */}
      {(skills.length > 0 || tech.length > 0) && (
        <ResumeSection title="Skills & Tools" variant="designer">
          {categories.length > 0 ? (
            <SkillsSection categories={categories} variant="designer" />
          ) : (
            <SkillsSection
              skills={data.skills}
              technologies={data.technologies}
              variant="designer"
            />
          )}
        </ResumeSection>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="designer">
          <EducationSection education={data.education} variant="designer" />
        </ResumeSection>
      )}

      {/* 7. RECOGNITION & HONORS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="designer"
          title="Recognition & Honors"
        />
      )}

      {/* 8. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="designer"
        />
      )}

      {/* 9. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="designer" />
      )}
    </div>
  );
}
