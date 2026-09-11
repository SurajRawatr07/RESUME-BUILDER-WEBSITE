import React from 'react';
import { Experience } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { formatBulletPoints } from '@/lib/resumeUtils';

interface ExperienceSectionProps {
  experiences?: Experience[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  variant = 'latex',
  title = 'Professional Experience',
}) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {experiences.map((exp) => {
        const bullets = formatBulletPoints(exp.description);
        const dateString = `${formatDate(exp.startDate)} – ${
          exp.current ? 'Present' : formatDate(exp.endDate)
        }`;

        if (variant === 'serif') {
          return (
            <div key={exp.id} className="text-[9pt] font-serif break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black">{exp.company}</span>
                <span className="text-gray-900 italic">{exp.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="italic text-gray-800">{exp.jobTitle}</span>
                <span className="text-gray-800">{dateString}</span>
              </div>
              {bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-gray-900 leading-snug">
                  {bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        if (variant === 'executive') {
          return (
            <div key={exp.id} className="text-[9pt] font-sans break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-900 text-[9.5pt]">{exp.jobTitle}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-slate-700">{exp.company}</span>
                </div>
                <span className="text-slate-600 text-[8.5pt] font-medium">{dateString}</span>
              </div>
              {exp.location && (
                <div className="text-[8pt] text-slate-500 italic mb-1">{exp.location}</div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-slate-800 leading-snug mt-1">
                  {bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        // Overleaf / LaTeX Standard
        return (
          <div key={exp.id} className="text-[8.5pt] font-sans break-inside-avoid print:break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-gray-900">{exp.jobTitle}</span>
              <span className="text-gray-700 text-[8pt] font-medium">{dateString}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1 text-[8pt]">
              <span className="italic text-gray-800">{exp.company}</span>
              {exp.location && <span className="text-gray-600">{exp.location}</span>}
            </div>
            {bullets.length > 0 && (
              <ul className="list-disc pl-4 space-y-0.5 text-gray-800 leading-snug">
                {bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};
