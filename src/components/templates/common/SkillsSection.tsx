import React from 'react';

interface SkillsCategory {
  label: string;
  items: string[];
}

interface SkillsSectionProps {
  skills?: string[];
  technologies?: string[];
  categories?: SkillsCategory[];
  variant?: 'latex' | 'serif' | 'executive' | 'designer';
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills = [],
  technologies = [],
  categories,
  variant = 'latex',
}) => {
  const hasSkills = skills && skills.length > 0;
  const hasTech = technologies && technologies.length > 0;
  const hasCategories = categories && categories.length > 0;

  if (!hasSkills && !hasTech && !hasCategories) return null;

  // Custom categorized view if provided
  if (hasCategories && categories) {
    const validCats = categories.filter((c) => c.items && c.items.length > 0);
    if (validCats.length === 0) return null;

    if (variant === 'serif') {
      return (
        <div className="text-[9pt] font-serif space-y-1 text-gray-900 leading-snug">
          {validCats.map((cat, i) => (
            <div key={i} className="flex">
              <span className="font-bold text-black min-w-[140px]">{cat.label}: </span>
              <span className="flex-1 text-gray-800">{cat.items.join(', ')}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-[8.5pt] font-sans space-y-1 text-gray-800 leading-snug">
        {validCats.map((cat, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-baseline">
            <span className="font-bold text-gray-900 min-w-[150px] shrink-0">
              {cat.label}:{' '}
            </span>
            <span className="flex-1 text-gray-800">{cat.items.join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  // Standard 2-row Overleaf key-value display
  if (variant === 'serif') {
    return (
      <div className="text-[9pt] font-serif space-y-1 text-gray-900 leading-snug">
        {hasTech && (
          <div className="flex">
            <span className="font-bold text-black min-w-[130px]">Technical Skills: </span>
            <span className="flex-1 text-gray-800">{technologies.join(', ')}</span>
          </div>
        )}
        {hasSkills && (
          <div className="flex">
            <span className="font-bold text-black min-w-[130px]">Core Competencies: </span>
            <span className="flex-1 text-gray-800">{skills.join(', ')}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-[8.5pt] font-sans space-y-0.5 text-gray-800 leading-snug">
      {hasTech && (
        <div className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="font-bold text-gray-900 min-w-[130px] shrink-0">
            Technologies & Tools:{' '}
          </span>
          <span className="flex-1 text-gray-800">{technologies.join(', ')}</span>
        </div>
      )}
      {hasSkills && (
        <div className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="font-bold text-gray-900 min-w-[130px] shrink-0">
            Core Competencies:{' '}
          </span>
          <span className="flex-1 text-gray-800">{skills.join(', ')}</span>
        </div>
      )}
    </div>
  );
};
