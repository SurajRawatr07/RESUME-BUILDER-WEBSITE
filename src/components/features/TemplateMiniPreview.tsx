import React from 'react';
import { TemplateDefinition } from '../templates/registry';

interface TemplateMiniPreviewProps {
  template: TemplateDefinition;
}

export const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({ template }) => {
  return (
    <div
      className="w-full aspect-[210/297] bg-white border border-gray-300 rounded-xs p-3.5 text-[7px] text-gray-900 shadow-sm flex flex-col justify-between select-none overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* Top Header Simulation */}
      <div className="border-b border-gray-900 pb-1 mb-1.5 text-center">
        <div className="font-bold text-[8.5px] tracking-tight uppercase text-gray-950">
          YOUR NAME
        </div>
        <div className="text-[6px] text-gray-600 mb-0.5 tracking-wide">
          {template.role}
        </div>
        <div className="flex items-center justify-center gap-1 text-[5px] text-gray-500">
          <span>email@example.com</span>
          <span>•</span>
          <span>LinkedIn</span>
          <span>•</span>
          <span>GitHub</span>
        </div>
      </div>

      {/* Structured Sections simulation based on the template's real hierarchy */}
      <div className="space-y-1.5 flex-1">
        {template.sectionHierarchy.slice(1, 5).map((sectionName, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-0.5">
              <span className="font-bold uppercase tracking-wider text-[6px] text-gray-950">
                {sectionName}
              </span>
              <span className="text-[4.5px] text-gray-400">Overleaf / LaTeX</span>
            </div>

            {/* Simulated bullet lines */}
            <div className="space-y-0.5 pt-0.5">
              <div className="flex justify-between items-center text-[5px] font-semibold text-gray-800">
                <span className="truncate max-w-[110px]">
                  {idx === 0 && template.id === 'undergraduate-cv'
                    ? 'B.Tech in Computer Science (8.6 GPA)'
                    : idx === 0 && (template.id === 'software-engineer' || template.id === 'swe-resume')
                    ? 'B.Tech in Computer Science & Engineering'
                    : idx === 0 && template.id === 'cs-it-swe'
                    ? 'Languages: TypeScript, Python, C++, SQL'
                    : 'Software Engineer • Tech Solutions Inc.'}
                </span>
                <span className="text-gray-500 text-[4.5px]">2021 – Present</span>
              </div>
              <div className="w-full h-0.5 bg-gray-300 rounded-xs" />
              <div className="w-5/6 h-0.5 bg-gray-300 rounded-xs" />
              <div className="w-4/6 h-0.5 bg-gray-200 rounded-xs" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer stamp */}
      <div className="mt-1 pt-1 border-t border-gray-200 flex items-center justify-between text-[5px] text-gray-500">
        <span className="uppercase font-semibold text-gray-700 tracking-wider">
          {template.tag}
        </span>
        <span className="text-emerald-700 font-medium">ATS Verified • A4</span>
      </div>
    </div>
  );
};
