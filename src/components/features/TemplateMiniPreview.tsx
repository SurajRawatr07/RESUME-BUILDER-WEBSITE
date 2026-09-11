import React from 'react';
import { TemplateDefinition } from '../templates/registry';

interface TemplateMiniPreviewProps {
  template: TemplateDefinition;
}

export const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({ template }) => {
  const isSerif = template.id === 'finance-consulting';
  const isDesigner = template.id === 'ui-ux-designer' || template.id === 'creative-general';

  return (
    <div
      className={`w-full aspect-[210/297] bg-white border border-gray-200 rounded-sm p-4 text-[7px] text-gray-800 shadow-inner flex flex-col justify-between select-none overflow-hidden ${
        isSerif ? 'font-serif' : 'font-sans'
      }`}
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      {/* Top Header Simulation */}
      <div className="border-b border-gray-900 pb-1.5 mb-2 text-center">
        <div className="font-bold text-[9px] tracking-tight uppercase text-gray-950">
          SURAAJ RAWAT
        </div>
        <div className="text-[6.5px] text-gray-600 mb-0.5">
          {template.role}
        </div>
        <div className="flex items-center justify-center gap-1 text-[5.5px] text-gray-500">
          <span>haldwani, india</span>
          <span>•</span>
          <span>email@example.com</span>
          <span>•</span>
          <span>linkedin/in/suraj</span>
        </div>
      </div>

      {/* Structured Sections simulation based on the template's real hierarchy */}
      <div className="space-y-1.5 flex-1">
        {template.sectionHierarchy.slice(1, 5).map((sectionName, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-0.5">
              <span className="font-bold uppercase tracking-wider text-[6.5px] text-gray-900">
                {sectionName}
              </span>
              <span className="text-[5px] text-gray-400">Overleaf / LaTeX</span>
            </div>

            {/* Simulated bullet lines */}
            <div className="space-y-0.5 pt-0.5">
              <div className="flex justify-between items-center text-[5.5px] font-semibold text-gray-800">
                <span className="truncate max-w-[100px]">
                  {idx === 0 && template.id === 'finance-consulting'
                    ? 'B.S. in Computer Science & Finance'
                    : idx === 0 && template.id === 'software-engineer'
                    ? 'Languages: TypeScript, Python, SQL, C++'
                    : 'Senior Professional Specialist'}
                </span>
                <span className="text-gray-500 text-[5px]">2021 – Present</span>
              </div>
              <div className="w-full h-1 bg-gray-200 rounded-xs" />
              <div className="w-5/6 h-1 bg-gray-200 rounded-xs" />
              <div className="w-4/6 h-1 bg-gray-100 rounded-xs" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer stamp */}
      <div className="mt-1 pt-1 border-t border-gray-200 flex items-center justify-between text-[5.5px] text-gray-500">
        <span className="font-mono uppercase font-medium tracking-wider">
          {template.tag}
        </span>
        <span>A4 ATS-Ready</span>
      </div>
    </div>
  );
};
