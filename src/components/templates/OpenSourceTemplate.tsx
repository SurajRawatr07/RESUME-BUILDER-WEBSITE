import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function OpenSourceTemplate({ data }: TemplateProps) {
  const cat = categorizeSkills(data);
  const hasAnySkills =
    cat.languages.length > 0 ||
    cat.tools.length > 0 ||
    cat.frontend.length > 0 ||
    cat.backend.length > 0 ||
    cat.databases.length > 0 ||
    cat.coreCS.length > 0 ||
    cat.ai.length > 0 ||
    cat.other.length > 0;

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
      {/* 1. OPEN SOURCE MAINTAINER HEADER */}
      <header className="border-b-2 border-black pb-2 mb-2.5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22pt] font-bold uppercase tracking-tight text-black leading-tight break-words">
              {data.fullName || 'Your Name'}
            </h1>
            {data.jobTitle && (
              <p className="text-[10pt] font-bold text-gray-800 tracking-wide mt-0.5 break-words">
                {data.jobTitle}
              </p>
            )}
          </div>
          <div className="min-w-0 w-full sm:w-auto sm:max-w-[54%] text-[8.5pt] text-gray-800 flex flex-col items-start sm:items-end gap-0.5">
            <div className="flex flex-wrap items-center sm:justify-end gap-x-2 gap-y-0.5">
              <ContactItem type="github" value={data.github} />
              {data.github && (data.portfolio || data.website) && <span aria-hidden="true">•</span>}
              <ContactItem type="portfolio" value={data.portfolio || data.website} />
            </div>
            <div className="flex flex-wrap items-center sm:justify-end gap-x-2 gap-y-0.5">
              <ContactItem type="email" value={data.email} />
              {data.email && data.linkedin && <span aria-hidden="true">•</span>}
              <ContactItem type="linkedin" value={data.linkedin} />
            </div>
            <div className="flex flex-wrap items-center sm:justify-end gap-x-2 gap-y-0.5">
              <ContactItem type="location" value={data.location} />
              {data.location && data.phone && <span aria-hidden="true">•</span>}
              <ContactItem type="phone" value={data.phone} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. OPEN SOURCE HIGHLIGHTS & SUMMARY */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2.5">
          <p className="text-[9pt] text-gray-900 leading-relaxed text-left">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. OPEN SOURCE PROJECTS & LIBRARIES */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
            Open Source Projects &amp; Packages
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => {
              const bullets = parseBullets(proj.description);
              return (
                <div key={proj.id} className="break-inside-avoid print:break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
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
                        className="text-[8pt] text-gray-800 hover:underline shrink-0"
                      />
                    )}
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-gray-900 mt-0.5 text-left">
                      {bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    proj.description && (
                      <p className="text-[9pt] text-gray-900 leading-snug mt-0.5 text-left">
                        {proj.description}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. WORK & MAINTAINER EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
            Experience &amp; Community Leadership
          </h2>
          <div className="space-y-2">
            {data.experiences.map((exp) => {
              const bullets = parseBullets(exp.description);
              return (
                <div key={exp.id} className="break-inside-avoid print:break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-[9.5pt] text-black min-w-0">
                      {exp.company}
                    </span>
                    <span className="text-[8.5pt] font-medium text-gray-700 shrink-0 text-right">
                      {exp.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <span className="italic text-[9pt] font-semibold text-gray-900 min-w-0">
                      {exp.jobTitle}
                    </span>
                    <span className="text-[8.5pt] italic text-gray-700 shrink-0 text-right">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-0.5 text-[9pt] text-gray-900 text-left">
                      {bullets.map((b, idx) => (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    exp.description && (
                      <p className="text-[9pt] text-gray-900 leading-snug text-left">
                        {exp.description}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. TECHNICAL STACK & ECOSYSTEM */}
      {hasAnySkills && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black break-after-avoid print:break-after-avoid">
            Technical Stack &amp; Tooling
          </h2>
          <div className="space-y-0.5 text-[9pt] leading-snug">
            {cat.languages.length > 0 && (
              <div>
                <span className="font-bold text-black">Languages: </span>
                <span className="text-gray-900">{cat.languages.join(', ')}</span>
              </div>
            )}
            {cat.tools.length > 0 && (
              <div>
                <span className="font-bold text-black">Tooling &amp; Build Systems: </span>
                <span className="text-gray-900">{cat.tools.join(', ')}</span>
              </div>
            )}
            {(cat.frontend.length > 0 || cat.backend.length > 0 || cat.databases.length > 0) && (
              <div>
                <span className="font-bold text-black">Frameworks &amp; Infrastructure: </span>
                <span className="text-gray-900">
                  {[...cat.frontend, ...cat.backend, ...cat.databases].join(', ')}
                </span>
              </div>
            )}
            {(cat.coreCS.length > 0 || cat.ai.length > 0 || cat.other.length > 0) && (
              <div>
                <span className="font-bold text-black">Additional Competencies: </span>
                <span className="text-gray-900">
                  {[...cat.coreCS, ...cat.ai, ...cat.other].join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black break-after-avoid print:break-after-avoid">
            Education
          </h2>
          <div className="space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-[9.5pt] text-black min-w-0">{edu.institution}</span>
                  <span className="text-[8.5pt] text-gray-700 shrink-0 text-right">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="italic text-[9pt] text-gray-900 min-w-0">
                    {edu.degree} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </span>
                  <span className="text-[8.5pt] italic text-gray-700 shrink-0 text-right">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black break-after-avoid print:break-after-avoid">
            Community Honors &amp; Recognition
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
