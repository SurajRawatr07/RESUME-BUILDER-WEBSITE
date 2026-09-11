import React from 'react';
import { ResumeData } from '@/types/resume';
import { cleanUrl, ensureHttp } from '@/lib/resumeUtils';
import { Globe, Linkedin, Github } from 'lucide-react';

interface ResumeHeaderProps {
  data: ResumeData;
  variant?: 'latex' | 'serif' | 'executive' | 'modern' | 'minimal' | 'designer';
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ data, variant = 'latex' }) => {
  const {
    fullName,
    jobTitle,
    email,
    phone,
    location,
    linkedin,
    github,
    portfolio,
    website,
  } = data;

  const activePortfolio = portfolio || website;

  // 1. CLASSIC FINANCE / CONSULTING / SERIF HEADER (Wall Street Oasis / Harvard style)
  if (variant === 'serif') {
    return (
      <header className="mb-4 text-center border-b border-black pb-2.5">
        <h1 className="text-[20pt] font-serif font-bold tracking-normal uppercase text-black leading-tight mb-1">
          {fullName || 'YOUR NAME'}
        </h1>
        {jobTitle && (
          <p className="text-[10pt] font-serif italic text-gray-800 mb-1.5">
            {jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-[9pt] font-serif text-gray-900 leading-tight">
          {location && <span>{location}</span>}
          {location && phone && <span className="text-gray-400">•</span>}
          {phone && <span>{phone}</span>}
          {phone && email && <span className="text-gray-400">•</span>}
          {email && (
            <a href={`mailto:${email}`} className="text-black hover:underline">
              {email}
            </a>
          )}
          {linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <a
                href={ensureHttp(linkedin)}
                target="_blank"
                rel="noreferrer"
                className="text-black hover:underline"
              >
                {cleanUrl(linkedin)}
              </a>
            </>
          )}
          {activePortfolio && (
            <>
              <span className="text-gray-400">•</span>
              <a
                href={ensureHttp(activePortfolio)}
                target="_blank"
                rel="noreferrer"
                className="text-black hover:underline"
              >
                {cleanUrl(activePortfolio)}
              </a>
            </>
          )}
        </div>
      </header>
    );
  }

  // 2. EXECUTIVE / PRODUCT MANAGER / BUSINESS HEADER
  if (variant === 'executive') {
    return (
      <header className="mb-4 pb-3 border-b-2 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
          <div>
            <h1 className="text-[22pt] font-bold text-slate-900 tracking-tight leading-none">
              {fullName || 'YOUR NAME'}
            </h1>
            {jobTitle && (
              <p className="text-[11pt] font-semibold text-slate-700 mt-1 uppercase tracking-wide">
                {jobTitle}
              </p>
            )}
          </div>
          <div className="text-[9pt] text-slate-700 sm:text-right space-y-0.5 mt-1 sm:mt-0">
            {location && <div>{location}</div>}
            <div className="flex items-center gap-2 sm:justify-end">
              {phone && <span>{phone}</span>}
              {phone && email && <span>•</span>}
              {email && (
                <a href={`mailto:${email}`} className="text-slate-900 hover:underline font-medium">
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>
        {(linkedin || github || activePortfolio) && (
          <div className="flex flex-wrap items-center gap-x-3 text-[8.5pt] text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200">
            {linkedin && (
              <a
                href={ensureHttp(linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 hover:underline"
              >
                <Linkedin className="w-3 h-3 text-slate-700" />
                <span>{cleanUrl(linkedin)}</span>
              </a>
            )}
            {github && (
              <a
                href={ensureHttp(github)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 hover:underline"
              >
                <Github className="w-3 h-3 text-slate-700" />
                <span>{cleanUrl(github)}</span>
              </a>
            )}
            {activePortfolio && (
              <a
                href={ensureHttp(activePortfolio)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 hover:underline"
              >
                <Globe className="w-3 h-3 text-slate-700" />
                <span>{cleanUrl(activePortfolio)}</span>
              </a>
            )}
          </div>
        )}
      </header>
    );
  }

  // 3. DESIGNER / EDITORIAL HEADER (UI/UX Designer, Creative)
  if (variant === 'designer') {
    return (
      <header className="mb-4 pb-3 border-b border-gray-300">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-[23pt] font-semibold text-gray-950 tracking-tight leading-none">
              {fullName || 'YOUR NAME'}
            </h1>
            {jobTitle && (
              <p className="text-[11pt] font-medium text-gray-600 mt-1">
                {jobTitle}
              </p>
            )}
          </div>
          {activePortfolio && (
            <div className="sm:text-right">
              <span className="text-[7.5pt] uppercase tracking-widest text-gray-500 block font-semibold">
                Portfolio
              </span>
              <a
                href={ensureHttp(activePortfolio)}
                target="_blank"
                rel="noreferrer"
                className="text-[10pt] font-medium text-gray-900 underline underline-offset-2 hover:text-black"
              >
                {cleanUrl(activePortfolio)}
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 text-[8.5pt] text-gray-600 mt-2.5">
          {email && (
            <a href={`mailto:${email}`} className="hover:text-black hover:underline">
              {email}
            </a>
          )}
          {email && phone && <span className="text-gray-300">|</span>}
          {phone && <span>{phone}</span>}
          {phone && location && <span className="text-gray-300">|</span>}
          {location && <span>{location}</span>}
          {linkedin && (
            <>
              <span className="text-gray-300">|</span>
              <a
                href={ensureHttp(linkedin)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black hover:underline"
              >
                {cleanUrl(linkedin)}
              </a>
            </>
          )}
        </div>
      </header>
    );
  }

  // 4. OVERLEAF / LATEX COMPACT STANDARD (Software Engineer, Student, Data Analyst, AI/ML)
  return (
    <header className="mb-3 text-center border-b border-gray-900 pb-2">
      <h1 className="text-[20pt] font-bold text-gray-900 tracking-tight leading-tight">
        {fullName || 'YOUR NAME'}
      </h1>
      {jobTitle && (
        <p className="text-[9.5pt] font-medium text-gray-700 mb-1">
          {jobTitle}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-2 text-[8.5pt] text-gray-800 leading-relaxed">
        {phone && <span>{phone}</span>}
        {phone && email && <span className="text-gray-400">|</span>}
        {email && (
          <a href={`mailto:${email}`} className="text-gray-900 hover:underline">
            {email}
          </a>
        )}
        {location && (
          <>
            <span className="text-gray-400">|</span>
            <span>{location}</span>
          </>
        )}
        {linkedin && (
          <>
            <span className="text-gray-400">|</span>
            <a
              href={ensureHttp(linkedin)}
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 hover:underline inline-flex items-center gap-1"
            >
              <Linkedin className="w-2.5 h-2.5 text-gray-700" />
              <span>{cleanUrl(linkedin)}</span>
            </a>
          </>
        )}
        {github && (
          <>
            <span className="text-gray-400">|</span>
            <a
              href={ensureHttp(github)}
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 hover:underline inline-flex items-center gap-1"
            >
              <Github className="w-2.5 h-2.5 text-gray-700" />
              <span>{cleanUrl(github)}</span>
            </a>
          </>
        )}
        {activePortfolio && (
          <>
            <span className="text-gray-400">|</span>
            <a
              href={ensureHttp(activePortfolio)}
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 hover:underline inline-flex items-center gap-1"
            >
              <Globe className="w-2.5 h-2.5 text-gray-700" />
              <span>{cleanUrl(activePortfolio)}</span>
            </a>
          </>
        )}
      </div>
    </header>
  );
};
