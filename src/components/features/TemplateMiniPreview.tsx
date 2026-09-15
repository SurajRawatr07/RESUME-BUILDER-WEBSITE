import React, { useRef, useState, useEffect } from 'react';
import { TemplateDefinition } from '../templates/registry';
import { getDemoDataForTemplate } from '@/data/demoResumeData';
import { ResumeData } from '@/types/resume';

interface TemplateMiniPreviewProps {
  template: TemplateDefinition;
  liveData?: ResumeData;
}

export const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({ template, liveData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);
  const dataToRender = (liveData && (liveData.fullName || liveData.skills?.length)) ? liveData : getDemoDataForTemplate(template.id);
  const Component = template.component;

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setScale(width / 794);
        }
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[210/297] bg-white border border-gray-200 dark:border-gray-700 rounded-sm shadow-xs relative overflow-hidden select-none"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          userSelect: 'none',
          backgroundColor: '#ffffff',
        }}
      >
        <Component data={dataToRender} />
      </div>

      {/* Subtle bottom role badge */}
      <div className="absolute bottom-1 right-1.5 z-10 pointer-events-none">
        <span className="text-[7.5px] font-semibold bg-gray-900/80 text-white px-1.5 py-0.5 rounded shadow-xs tracking-wide">
          {template.tag}
        </span>
      </div>
    </div>
  );
};
