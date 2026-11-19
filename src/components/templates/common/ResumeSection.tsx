import React from 'react';

interface ResumeSectionProps {
  title: string;
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
  children: React.ReactNode;
  className?: string;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  title,
  variant = 'latex',
  children,
  className = '',
}) => {
  if (!children) return null;

  // Serif (Finance / Consulting)
  if (variant === 'serif') {
    return (
      <section className={`mb-3.5 ${className}`}>
        <h2 className="text-[10pt] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 break-after-avoid print:break-after-avoid">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  // Executive (Product Manager / Business)
  if (variant === 'executive') {
    return (
      <section className={`mb-3.5 ${className}`}>
        <h2 className="text-[10.5pt] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-700 pb-0.5 mb-2 break-after-avoid print:break-after-avoid">
          {title}
        </h2>
        {children}
      </section>
    );
  }

  // Designer (UI/UX Designer / Creative)
  if (variant === 'designer') {
    return (
      <section className={`mb-4 ${className}`}>
        <h2 className="text-[10.5pt] font-semibold tracking-wide text-gray-900 border-b border-gray-300 pb-1 mb-2.5 flex items-center justify-between break-after-avoid print:break-after-avoid">
          <span>{title}</span>
        </h2>
        {children}
      </section>
    );
  }

  // Overleaf / LaTeX Standard (Software Engineer, AI/ML, Data Analyst, Student)
  return (
    <section className={`mb-3 ${className}`}>
      <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 mb-2 break-after-avoid print:break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
};
