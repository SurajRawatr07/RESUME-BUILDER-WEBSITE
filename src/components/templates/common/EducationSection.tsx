import React from 'react';
import { Education } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface EducationSectionProps {
  education?: Education[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  variant = 'latex',
}) => {
  if (!education || education.length === 0) return null;

  return (
    <div className="space-y-2">
      {education.map((edu) => {
        const gradDate = formatDate(edu.graduationDate);

        if (variant === 'serif') {
          return (
            <div key={edu.id} className="text-[9pt] font-serif break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black">{edu.institution}</span>
                <span className="text-gray-900 italic">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic text-gray-800">{edu.degree}</span>
                <span className="text-gray-850">{gradDate}</span>
              </div>
              {(edu.gpa || edu.description) && (
                <div className="text-[8.5pt] text-gray-800 mt-0.5">
                  {edu.gpa && <span className="font-medium">GPA: {edu.gpa} </span>}
                  {edu.gpa && edu.description && <span>• </span>}
                  {edu.description && <span>{edu.description}</span>}
                </div>
              )}
            </div>
          );
        }

        if (variant === 'executive') {
          return (
            <div key={edu.id} className="text-[9pt] font-sans break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{edu.institution}</span>
                <span className="text-slate-600 text-[8.5pt]">{gradDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-[8.5pt]">
                <span className="text-slate-700 font-medium">{edu.degree}</span>
                {edu.location && <span className="text-slate-500 italic">{edu.location}</span>}
              </div>
              {(edu.gpa || edu.description) && (
                <div className="text-[8pt] text-slate-600 mt-0.5">
                  {edu.gpa && <span className="font-semibold text-slate-700">GPA: {edu.gpa} </span>}
                  {edu.gpa && edu.description && <span>• </span>}
                  {edu.description && <span>{edu.description}</span>}
                </div>
              )}
            </div>
          );
        }

        // Overleaf / LaTeX Standard
        return (
          <div key={edu.id} className="text-[8.5pt] font-sans break-inside-avoid print:break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-gray-900">{edu.institution}</span>
              <span className="text-gray-700 text-[8pt] font-medium">{gradDate}</span>
            </div>
            <div className="flex justify-between items-baseline text-[8pt]">
              <span className="italic text-gray-800">{edu.degree}</span>
              {edu.location && <span className="text-gray-600">{edu.location}</span>}
            </div>
            {(edu.gpa || edu.description) && (
              <div className="text-[8pt] text-gray-700 mt-0.5">
                {edu.gpa && <span className="font-medium text-gray-900">GPA: {edu.gpa} </span>}
                {edu.gpa && edu.description && <span>• </span>}
                {edu.description && <span>{edu.description}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
