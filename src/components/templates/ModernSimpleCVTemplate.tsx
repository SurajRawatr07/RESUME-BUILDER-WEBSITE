import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function ModernSimpleCVTemplate({ data }: TemplateProps) {
  const cat = categorizeSkills(data);

  return (
    <div
      className="w-full bg-white text-black p-6 sm:p-7 md:p-8 mx-auto box-border print:p-0 print:shadow-none"
      style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '9.5pt',
        lineHeight: '1.35',
        color: '#000000',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. MODERN FRONTEND / UI DEVELOPER HEADER */}
      <header className="pb-2 mb-2 border-b border-gray-400">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <h1 className="text-[22pt] font-normal tracking-wide uppercase text-black leading-none">
              {data.fullName || 'Suraj Rawat'}
            </h1>
            <div className="text-[10pt] font-semibold text-gray-800 tracking-wider uppercase mt-1">
              Frontend Developer • UI & Web Engineer
            </div>
          </div>
          <div className="text-[8.5pt] text-gray-700 text-left sm:text-right mt-1 sm:mt-0">
            <div>{data.location}</div>
            <div>{data.phone} • <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[8.5pt] text-gray-800 mt-1.5 pt-1 border-t border-gray-200">
          {data.portfolio && (
            <span>
              Portfolio: <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.portfolio)}</a>
            </span>
          )}
          {data.github && (
            <span>
              • GitHub: <a href={`https://${cleanUrl(data.github)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.github)}</a>
            </span>
          )}
          {data.linkedin && (
            <span>
              • LinkedIn: <a href={`https://${cleanUrl(data.linkedin)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.linkedin)}</a>
            </span>
          )}
          {data.leetcode && (
            <span>
              • LeetCode: <a href={`https://${cleanUrl(data.leetcode)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.leetcode)}</a>
            </span>
          )}
        </div>
      </header>

      {/* 2. FRONTEND & UI PROFILE */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
            Frontend Profile
          </h2>
          <p className="text-[9pt] leading-snug text-gray-900 text-justify">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. FRONTEND & WEB COMPETENCIES */}
      <section className="mb-2">
        <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
          Frontend & Technical Skills
        </h2>
        <div className="text-[8.5pt] leading-tight space-y-0.5">
          {cat.frontend.length > 0 && (
            <div>
              <span className="font-bold text-black">UI & Frontend: </span>
              <span className="text-gray-900">{cat.frontend.join(', ')}</span>
            </div>
          )}
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {cat.backend.length > 0 && (
            <div>
              <span className="font-bold text-black">Backend & APIs: </span>
              <span className="text-gray-900">{cat.backend.join(', ')}</span>
            </div>
          )}
          {cat.tools.length > 0 && (
            <div>
              <span className="font-bold text-black">Build & Workflow: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
          {cat.databases.length > 0 && (
            <div>
              <span className="font-bold text-black">Databases: </span>
              <span className="text-gray-900">{cat.databases.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. WEB DEVELOPMENT EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
            Experience
          </h2>
          <div className="space-y-1.5">
            {data.experiences.map((exp) => {
              const bullets = parseBullets(exp.description);
              const dateRange = exp.current
                ? `${exp.startDate} – Present`
                : exp.endDate
                ? `${exp.startDate} – ${exp.endDate}`
                : exp.startDate;

              return (
                <div key={exp.id} className="text-[9pt]">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>{exp.jobTitle} <span className="font-normal italic text-gray-700">@ {exp.company}</span></span>
                    <span className="text-[8.5pt] font-normal text-gray-800">{dateRange}</span>
                  </div>
                  {exp.location && (
                    <div className="text-[8pt] text-gray-600 -mt-0.5 mb-0.5">{exp.location}</div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-900 text-[8.5pt]">
                      {bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. INTERACTIVE WEB APPLICATIONS / PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
            Featured Web Projects
          </h2>
          <div className="space-y-1.5">
            {data.projects.map((proj) => {
              const bullets = parseBullets(proj.description);
              const dateRange = proj.endDate
                ? `${proj.startDate} – ${proj.endDate}`
                : proj.startDate;

              return (
                <div key={proj.id} className="text-[9pt]">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span>{proj.title} <span className="font-normal italic text-[8.5pt] text-gray-700">({proj.technologies})</span></span>
                    {dateRange && <span className="text-[8.5pt] font-normal text-gray-800">{dateRange}</span>}
                  </div>
                  {proj.link && (
                    <div className="text-[8pt] text-gray-700">
                      Demo/Code: <a href={`https://${cleanUrl(proj.link)}`} target="_blank" rel="noreferrer" className="underline text-black">{cleanUrl(proj.link)}</a>
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-900 mt-0.5 text-[8.5pt]">
                      {bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
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
          <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="text-[9pt]">
              <div className="flex justify-between items-baseline font-bold text-black">
                <span>{edu.institution}, {edu.location}</span>
                <span className="text-[8.5pt] font-normal text-gray-800">{edu.graduationDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-gray-900">
                <span className="italic">{edu.degree}</span>
                {edu.gpa && <span className="font-semibold text-black">CGPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. ACHIEVEMENTS & CERTIFICATIONS */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <section>
          <h2 className="text-[10pt] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-1">
            Key Achievements
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements?.map((ach, idx) => (
              <li key={`mod-ach-${idx}`} className="leading-snug">{ach}</li>
            ))}
            {data.certifications?.map((cert) => (
              <li key={cert.id} className="leading-snug">
                <span className="font-semibold text-black">{cert.name}</span> — {cert.issuer}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
