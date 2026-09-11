import React from 'react';
import { Certification, Language } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { ResumeSection } from './ResumeSection';

interface SummarySectionProps {
  summary?: string;
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  variant = 'latex',
  title = 'Professional Summary',
}) => {
  if (!summary || !summary.trim()) return null;

  return (
    <ResumeSection title={title} variant={variant}>
      <p
        className={`leading-relaxed text-justify ${
          variant === 'serif'
            ? 'text-[9pt] font-serif text-gray-900'
            : variant === 'executive'
            ? 'text-[9pt] font-sans text-slate-800'
            : 'text-[8.5pt] font-sans text-gray-800'
        }`}
      >
        {summary}
      </p>
    </ResumeSection>
  );
};

interface CertificationsSectionProps {
  certifications?: Certification[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  variant = 'latex',
  title = 'Certifications',
}) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <ResumeSection title={title} variant={variant}>
      <div className="space-y-1">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className={`flex justify-between items-baseline ${
              variant === 'serif' ? 'text-[9pt] font-serif' : 'text-[8.5pt] font-sans'
            }`}
          >
            <div>
              <span className="font-bold text-gray-900">{cert.name}</span>
              {cert.issuer && (
                <span className="text-gray-700"> – {cert.issuer}</span>
              )}
            </div>
            {cert.date && (
              <span className="text-gray-600 text-[8pt] whitespace-nowrap ml-2">
                {formatDate(cert.date)}
              </span>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

interface AchievementsSectionProps {
  achievements?: string[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  variant = 'latex',
  title = 'Honors & Achievements',
}) => {
  if (!achievements || achievements.length === 0) return null;

  return (
    <ResumeSection title={title} variant={variant}>
      <ul
        className={`list-disc pl-4 space-y-0.5 leading-snug ${
          variant === 'serif'
            ? 'text-[9pt] font-serif text-gray-900'
            : 'text-[8.5pt] font-sans text-gray-800'
        }`}
      >
        {achievements.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </ResumeSection>
  );
};

interface LanguagesSectionProps {
  languages?: Language[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  variant = 'latex',
  title = 'Languages',
}) => {
  if (!languages || languages.length === 0) return null;

  return (
    <ResumeSection title={title} variant={variant}>
      <p
        className={`${
          variant === 'serif'
            ? 'text-[9pt] font-serif text-gray-900'
            : 'text-[8.5pt] font-sans text-gray-800'
        }`}
      >
        {languages
          .map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ''}`)
          .join(' • ')}
      </p>
    </ResumeSection>
  );
};
