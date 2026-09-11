import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function SoftwareEngineeringResumeTemplate({ data }: TemplateProps) {
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
      {/* 1. ENGINEERING HEADER */}
      <header className="border-b-2 border-black pb-2 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-baseline">
          <div>
            <h1 className="text-[22pt] font-bold tracking-tight text-black leading-none">
              {data.fullName || 'Suraj Rawat'}
            </h1>
            <div className="text-[10pt] font-semibold text-gray-800 tracking-wide mt-1">
              Software Engineer | Systems & Backend Developer
            </div>
          </div>
          <div className="text-[8.5pt] text-gray-800 text-left sm:text-right mt-1 sm:mt-0">
            <div>{data.location}</div>
            <div>
              {data.phone} | <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a>
            </div>
          </div>
        </div>

        {/* Links bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[8.5pt] text-gray-800 mt-1 pt-1 border-t border-gray-300">
          {data.github && (
            <span>
              GitHub: <a href={`https://${cleanUrl(data.github)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.github)}</a>
            </span>
          )}
          {data.linkedin && (
            <span>
              LinkedIn: <a href={`https://${cleanUrl(data.linkedin)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.linkedin)}</a>
            </span>
          )}
          {data.leetcode && (
            <span>
              LeetCode: <a href={`https://${cleanUrl(data.leetcode)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.leetcode)}</a>
            </span>
          )}
          {data.portfolio && (
            <span>
              Web: <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.portfolio)}</a>
            </span>
          )}
        </div>
      </header>

      {/* 2. ENGINEERING SUMMARY */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Engineering Summary
          </h2>
          <p className="text-[9pt] leading-snug text-gray-900 text-justify">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. EXPERIENCE FIRST (FOR EXPERIENCED/SYSTEMS ENGINEERS) */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Production & Engineering Experience
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
                    <span>{exp.jobTitle} — <span className="font-semibold text-gray-800">{exp.company}</span></span>
                    <span className="text-[8.5pt] font-normal text-gray-800">{dateRange}</span>
                  </div>
                  {exp.location && (
                    <div className="text-[8pt] text-gray-600 italic -mt-0.5 mb-0.5">{exp.location}</div>
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

      {/* 4. TECHNICAL SKILL MATRIX */}
      <section className="mb-2">
        <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
          Technical Skill Matrix
        </h2>
        <div className="text-[8.5pt] leading-tight space-y-0.5">
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {cat.backend.length > 0 && (
            <div>
              <span className="font-bold text-black">Backend & Systems: </span>
              <span className="text-gray-900">{cat.backend.join(', ')}</span>
            </div>
          )}
          {cat.databases.length > 0 && (
            <div>
              <span className="font-bold text-black">Databases & Architecture: </span>
              <span className="text-gray-900">{cat.databases.join(', ')}</span>
            </div>
          )}
          {cat.frontend.length > 0 && (
            <div>
              <span className="font-bold text-black">Frontend Stack: </span>
              <span className="text-gray-900">{cat.frontend.join(', ')}</span>
            </div>
          )}
          {cat.tools.length > 0 && (
            <div>
              <span className="font-bold text-black">DevOps & Cloud: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 5. PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            System Projects
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
                      Link: <a href={`https://${cleanUrl(proj.link)}`} target="_blank" rel="noreferrer" className="underline text-black">{cleanUrl(proj.link)}</a>
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
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
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
                {edu.gpa && <span className="font-semibold text-black">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Technical Achievements & Leadership
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements.map((ach, idx) => (
              <li key={`se-ach-${idx}`} className="leading-snug">{ach}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
