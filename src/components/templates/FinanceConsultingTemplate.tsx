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

export default function FinanceConsultingTemplate({ data }: TemplateProps) {
  const tech = data.technologies || [];
  const skills = data.skills || [];

  return (
    <div
      className="w-full bg-white text-black font-serif p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#000000',
        backgroundColor: '#ffffff',
        fontFamily: '"Times New Roman", Times, Georgia, serif',
      }}
    >
      {/* 1. TRADITIONAL WALL STREET / IVY LEAGUE SERIF HEADER */}
      <ResumeHeader data={data} variant="serif" />

      {/* 2. EDUCATION FIRST (Rigid Wall Street Oasis / Harvard Consulting Convention) */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="serif">
          <EducationSection education={data.education} variant="serif" />
        </ResumeSection>
      )}

      {/* 3. PROFESSIONAL EXPERIENCE (Deals, Engagements, Valuation, M&A) */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Professional Experience" variant="serif">
          <ExperienceSection experiences={data.experiences} variant="serif" />
        </ResumeSection>
      )}

      {/* 4. TRANSACTIONS & CONSULTING PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="Selected Engagements & Financial Modeling" variant="serif">
          <ProjectsSection projects={data.projects} variant="serif" />
        </ResumeSection>
      )}

      {/* 5. HONORS & ACADEMIC ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="serif"
          title="Honors & Awards"
        />
      )}

      {/* 6. SKILLS, CERTIFICATIONS & INTERESTS */}
      {(skills.length > 0 || tech.length > 0) && (
        <ResumeSection title="Skills & Certifications" variant="serif">
          <SkillsSection
            skills={data.skills}
            technologies={data.technologies}
            variant="serif"
          />
        </ResumeSection>
      )}

      {/* 7. FORMAL CERTIFICATIONS (e.g. CFA, CPA, Series 7) */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="serif"
        />
      )}

      {/* 8. LANGUAGES & PERSONAL INTERESTS */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="serif" />
      )}
    </div>
  );
}
