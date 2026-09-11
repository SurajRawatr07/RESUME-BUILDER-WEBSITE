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

export default function AIMLEngineerTemplate({ data }: TemplateProps) {
  const tech = data.technologies || [];
  const skills = data.skills || [];

  // Categorize for AI/ML
  const frameworks = tech.filter((t) =>
    /pytorch|tensorflow|jax|keras|scikit|hugging|onnx|cuda|triton|langchain|llamaindex/i.test(
      t
    )
  );
  const modelsAndMethods = skills.filter((s) =>
    /llm|rag|nlp|computer vision|diffusion|transformer|reinforcement|deep learning|fine-tuning|lora|generative ai/i.test(
      s
    )
  );
  const engineering = tech.filter(
    (t) => !frameworks.includes(t) && /docker|kubernetes|aws|gcp|mlops|fastapi|python|c\+\+|git/i.test(t)
  );
  const remaining = tech.filter(
    (t) => !frameworks.includes(t) && !engineering.includes(t)
  );

  const categories = [];
  if (frameworks.length > 0) {
    categories.push({ label: 'ML / DL Frameworks', items: frameworks });
  }
  if (modelsAndMethods.length > 0) {
    categories.push({ label: 'Architectures & Methods', items: modelsAndMethods });
  }
  if (engineering.length > 0) {
    categories.push({ label: 'MLOps & Systems', items: engineering });
  }
  if (remaining.length > 0) {
    categories.push({ label: 'Languages & Tools', items: remaining });
  }

  return (
    <div
      className="w-full bg-white text-gray-900 font-sans p-6 sm:p-8 md:p-10 shadow-sm print:p-0 print:shadow-none min-h-[297mm] mx-auto"
      style={{
        maxWidth: '210mm',
        color: '#0f172a',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. HEADER WITH GITHUB & LINKEDIN */}
      <ResumeHeader data={data} variant="latex" />

      {/* 2. RESEARCH / TECHNICAL SUMMARY */}
      {data.summary && (
        <SummarySection
          summary={data.summary}
          variant="latex"
          title="Research & Technical Summary"
        />
      )}

      {/* 3. AI / ML TECHNICAL COMPETENCIES */}
      {(tech.length > 0 || skills.length > 0) && (
        <ResumeSection title="Technical Competencies" variant="latex">
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

      {/* 4. EXPERIENCE / RESEARCH EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <ResumeSection title="Experience & Research" variant="latex">
          <ExperienceSection experiences={data.experiences} variant="latex" />
        </ResumeSection>
      )}

      {/* 5. AI / ML PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <ResumeSection title="AI / Machine Learning Projects" variant="latex">
          <ProjectsSection projects={data.projects} variant="latex" />
        </ResumeSection>
      )}

      {/* 6. PUBLICATIONS & RESEARCH ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <AchievementsSection
          achievements={data.achievements}
          variant="latex"
          title="Publications & Technical Achievements"
        />
      )}

      {/* 7. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <ResumeSection title="Education" variant="latex">
          <EducationSection education={data.education} variant="latex" />
        </ResumeSection>
      )}

      {/* 8. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <CertificationsSection
          certifications={data.certifications}
          variant="latex"
        />
      )}

      {/* 9. LANGUAGES */}
      {data.languages && data.languages.length > 0 && (
        <LanguagesSection languages={data.languages} variant="latex" />
      )}
    </div>
  );
}
