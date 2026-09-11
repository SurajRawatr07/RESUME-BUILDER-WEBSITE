import React from 'react';
import { Project } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { formatBulletPoints, cleanUrl, ensureHttp } from '@/lib/resumeUtils';
import { ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  projects?: Project[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  title?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  variant = 'latex',
}) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {projects.map((proj) => {
        const bullets = formatBulletPoints(proj.description);
        const dateRange = proj.startDate
          ? `${formatDate(proj.startDate)}${
              proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''
            }`
          : '';

        if (variant === 'serif') {
          return (
            <div key={proj.id} className="text-[9pt] font-serif break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-black">{proj.title}</span>
                  {proj.technologies && (
                    <span className="italic text-gray-800 text-[8.5pt]">
                      {' '}| {proj.technologies}
                    </span>
                  )}
                  {proj.link && (
                    <a
                      href={ensureHttp(proj.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-[8pt] text-gray-700 underline"
                    >
                      [{cleanUrl(proj.link)}]
                    </a>
                  )}
                </div>
                {dateRange && <span className="text-gray-800 text-[8.5pt]">{dateRange}</span>}
              </div>
              {bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-gray-900 leading-snug mt-0.5">
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        if (variant === 'designer') {
          return (
            <div key={proj.id} className="text-[8.5pt] font-sans break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-950 text-[9.5pt]">{proj.title}</span>
                  {proj.link && (
                    <a
                      href={ensureHttp(proj.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-black inline-flex items-center gap-0.5 text-[8pt]"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>{cleanUrl(proj.link)}</span>
                    </a>
                  )}
                </div>
                {dateRange && <span className="text-gray-500 text-[8pt]">{dateRange}</span>}
              </div>
              {proj.technologies && (
                <div className="text-[8pt] text-gray-600 mb-1">
                  <span className="font-medium text-gray-700">Tools: </span>
                  {proj.technologies}
                </div>
              )}
              {bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-gray-700 leading-snug">
                  {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        // Overleaf / LaTeX Standard
        return (
          <div key={proj.id} className="text-[8.5pt] font-sans break-inside-avoid print:break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <div className="flex-1 mr-2">
                <span className="font-bold text-gray-900">{proj.title}</span>
                {proj.technologies && (
                  <span className="text-gray-700 text-[8pt]">
                    {' '}| <span className="italic">{proj.technologies}</span>
                  </span>
                )}
                {proj.link && (
                  <a
                    href={ensureHttp(proj.link)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-800 underline ml-1.5 text-[7.5pt]"
                  >
                    [{cleanUrl(proj.link)}]
                  </a>
                )}
              </div>
              {dateRange && (
                <span className="text-gray-700 text-[8pt] font-medium whitespace-nowrap">
                  {dateRange}
                </span>
              )}
            </div>
            {bullets.length > 0 && (
              <ul className="list-disc pl-4 space-y-0.5 text-gray-800 leading-snug mt-0.5">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};
