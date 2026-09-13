import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function UIFrontendTemplate({ data }: TemplateProps) {
  const cat = categorizeSkills(data);

  return (
    <div
      className="w-full bg-white text-black p-6 sm:p-7 md:p-8 mx-auto box-border print:p-0 print:shadow-none"
      style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '9.5pt',
        lineHeight: '1.34',
        color: '#000000',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. UI ENGINEER MODERN HEADER */}
      <header className="border-b-2 border-black pb-2.5 mb-2.5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1.5">
          <div>
            <h1 className="text-[23pt] font-bold tracking-tight uppercase text-black leading-none">
              {data.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-[10pt] font-bold text-gray-800 tracking-wide mt-1">
              {data.jobTitle || 'UI Engineer & Design Systems Specialist'}
            </p>
          </div>
          <div className="text-[8.5pt] text-gray-800 flex flex-col items-start sm:items-end gap-0.5">
            <div className="flex items-center gap-2">
              <ContactItem type="portfolio" value={data.portfolio || data.website} />
              {(data.portfolio || data.website) && data.github && <span>•</span>}
              <ContactItem type="github" value={data.github} />
            </div>
            <div className="flex items-center gap-2">
              <ContactItem type="email" value={data.email} />
              {data.email && data.linkedin && <span>•</span>}
              <ContactItem type="linkedin" value={data.linkedin} />
            </div>
            <div className="flex items-center gap-2">
              <ContactItem type="location" value={data.location} />
              {data.location && data.phone && <span>•</span>}
              <ContactItem type="phone" value={data.phone} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUMMARY / FOCUS */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2">
          <p className="text-[9pt] text-gray-900 leading-relaxed text-justify">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. DESIGN SYSTEMS & UI SKILLS */}
      <section className="mb-2">
        <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black flex items-center justify-between">
          <span>Design Systems & Frontend Architecture</span>
          <span className="text-[7.5pt] font-normal tracking-normal text-gray-600">UI Systems • WCAG 2.1 • Animation • CSS</span>
        </h2>
        <div className="space-y-0.5 text-[9pt] leading-snug">
          <div>
            <span className="font-bold text-black">UI Architecture & Systems: </span>
            <span className="text-gray-900">
              {cat.frontend.length > 0 ? cat.frontend.join(', ') : 'React, Next.js, Tailwind CSS, Radix UI, Storybook, CSS Modules'}
            </span>
          </div>
          <div>
            <span className="font-bold text-black">Languages & Standards: </span>
            <span className="text-gray-900">
              {cat.languages.length > 0 ? cat.languages.join(', ') : 'TypeScript, JavaScript, HTML5 Semantics, CSS3 / Modern CSS'}
            </span>
          </div>
          <div>
            <span className="font-bold text-black">Accessibility & Interaction: </span>
            <span className="text-gray-900">
              WCAG 2.1 AA Compliance, WAI-ARIA, Micro-Interactions, Framer Motion, Responsive Design
            </span>
          </div>
          <div>
            <span className="font-bold text-black">Developer Tools: </span>
            <span className="text-gray-900">
              {cat.tools.length > 0 ? cat.tools.join(', ') : 'Figma, Storybook, Jest, Playwright, Git, Vite'}
            </span>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            UI & Frontend Experience
          </h2>
          <div className="space-y-2">
            {data.experiences.map((exp) => {
              const bullets = parseBullets(exp.description);
              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[9.5pt] text-black">
                      {exp.company}
                    </span>
                    <span className="text-[8.5pt] font-medium text-gray-700">
                      {exp.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="italic text-[9pt] font-semibold text-gray-900">
                      {exp.jobTitle}
                    </span>
                    <span className="text-[8.5pt] italic text-gray-700">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-gray-900">
                      {bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[9pt] text-gray-900 leading-snug">{exp.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. DESIGN & COMPONENT PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            Design Systems & Component Libraries
          </h2>
          <div className="space-y-1.5">
            {data.projects.map((proj) => {
              const bullets = parseBullets(proj.description);
              return (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[9.5pt] text-black">{proj.title}</span>
                      {proj.technologies && (
                        <span className="text-[8.5pt] text-gray-700 italic">
                          {' '}| {proj.technologies}
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <ContactItem
                        type="github"
                        value={proj.link}
                        className="text-[8pt] text-gray-800 hover:underline"
                      />
                    )}
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-gray-900 mt-0.5">
                      {bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[9pt] text-gray-900 leading-snug mt-0.5">{proj.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            Education
          </h2>
          <div className="space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[9.5pt] text-black">{edu.institution}</span>
                  <span className="text-[8.5pt] text-gray-700">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-[9pt] text-gray-900">
                    {edu.degree} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </span>
                  <span className="text-[8.5pt] italic text-gray-700">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. ACHIEVEMENTS & DESIGN RECOGNITION */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            Awards & Design Recognition
          </h2>
          <ul className="list-disc ml-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements.map((item, idx) => (
              <li key={idx} className="leading-snug">{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
