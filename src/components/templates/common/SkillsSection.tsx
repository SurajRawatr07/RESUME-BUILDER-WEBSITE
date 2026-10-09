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

const toFormattedList = (val: unknown): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val.filter(Boolean).map(String).join(', ');
  if (typeof val === 'string') return val;
  return String(val);
};

const hasItems = (val: unknown): boolean => {
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'string') return val.trim().length > 0;
  return Boolean(val);
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills = [],
  technologies = [],
  categories,
  variant = 'latex',
}) => {
  const hasSkills = hasItems(skills);
  const hasTech = hasItems(technologies);
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  if (!hasSkills && !hasTech && !hasCategories) return null;

  // Custom categorized view if provided
  if (hasCategories && categories) {
    const validCats = categories.filter((c) => c && hasItems(c.items));
    if (validCats.length === 0) return null;

    if (variant === 'serif') {
      return (
        <div className="text-[9pt] font-serif space-y-1 text-gray-900 leading-snug">
          {validCats.map((cat, i) => (
            <div key={i} className="flex">
              <span className="font-bold text-black min-w-[140px]">{cat.label}: </span>
              <span className="flex-1 text-gray-800">{toFormattedList(cat.items)}</span>
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
            <span className="flex-1 text-gray-800">{toFormattedList(cat.items)}</span>
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
            <span className="flex-1 text-gray-800">{toFormattedList(technologies)}</span>
          </div>
        )}
        {hasSkills && (
          <div className="flex">
            <span className="font-bold text-black min-w-[130px]">Core Competencies: </span>
            <span className="flex-1 text-gray-800">{toFormattedList(skills)}</span>
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
          <span className="flex-1 text-gray-800">{toFormattedList(technologies)}</span>
        </div>
      )}
      {hasSkills && (
        <div className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="font-bold text-gray-900 min-w-[130px] shrink-0">
            Core Competencies:{' '}
          </span>
          <span className="flex-1 text-gray-800">{toFormattedList(skills)}</span>
        </div>
      )}
    </div>
  );
};
