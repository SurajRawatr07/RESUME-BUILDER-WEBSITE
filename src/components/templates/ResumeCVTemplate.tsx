import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function ResumeCVTemplate({ data }: TemplateProps) {
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
      {/* 1. CLASSIC BALANCED RESUME / CV HEADER */}
      <header className="text-center pb-2 mb-2 border-b-2 border-black">
        <h1 className="text-[22pt] font-bold tracking-wide uppercase text-black leading-none mb-1">
          {data.fullName || 'Suraj Rawat'}
        </h1>
        <div className="text-[9.5pt] font-semibold text-gray-800 tracking-wider uppercase mb-1">
          {data.jobTitle || 'Software Engineer'} • General Resume / CV
        </div>
        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
          <span>{data.location}</span>
          <span>• Tel: {data.phone}</span>
          <span>• Email: <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a></span>
          {data.portfolio && (
            <span>• Web: <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.portfolio)}</a></span>
          )}
        </div>
        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 mt-0.5">
          {data.github && (
            <span>GitHub: <a href={`https://${cleanUrl(data.github)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.github)}</a></span>
          )}
          {data.linkedin && (
            <span>• LinkedIn: <a href={`https://${cleanUrl(data.linkedin)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.linkedin)}</a></span>
          )}
          {data.leetcode && (
            <span>• LeetCode: <a href={`https://${cleanUrl(data.leetcode)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.leetcode)}</a></span>
          )}
        </div>
      </header>

      {/* 2. CAREER SUMMARY */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Professional Summary
          </h2>
          <p className="text-[9pt] leading-snug text-gray-900 text-justify">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. TECHNICAL COMPETENCIES */}
      <section className="mb-2">
        <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
          Areas of Technical Competence
        </h2>
        <div className="text-[8.5pt] leading-tight space-y-0.5">
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Programming Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {cat.backend.length > 0 && (
            <div>
              <span className="font-bold text-black">Backend & APIs: </span>
              <span className="text-gray-900">{cat.backend.join(', ')}</span>
            </div>
          )}
          {cat.frontend.length > 0 && (
            <div>
              <span className="font-bold text-black">Frontend Development: </span>
              <span className="text-gray-900">{cat.frontend.join(', ')}</span>
            </div>
          )}
          {cat.databases.length > 0 && (
            <div>
              <span className="font-bold text-black">Databases & Storage: </span>
              <span className="text-gray-900">{cat.databases.join(', ')}</span>
            </div>
          )}
          {cat.tools.length > 0 && (
            <div>
              <span className="font-bold text-black">Tools & Platforms: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
          {cat.coreCS.length > 0 && (
            <div>
              <span className="font-bold text-black">Computer Science: </span>
              <span className="text-gray-900">{cat.coreCS.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. WORK EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Work Experience
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

      {/* 5. NOTABLE PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Notable Projects
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
                    <span>{proj.title} <span className="font-normal italic text-[8.5pt] text-gray-700">| {proj.technologies}</span></span>
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
            Education & Qualifications
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

      {/* 7. HONORS & LANGUAGES */}
      {((data.achievements && data.achievements.length > 0) || (data.languages && data.languages.length > 0)) && (
        <section>
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Honors & Languages
          </h2>
          <div className="text-[8.5pt] text-gray-900 space-y-1">
            {data.achievements && (
              <ul className="list-disc pl-4 space-y-0.5">
                {data.achievements.map((ach, idx) => (
                  <li key={`cv-ach-${idx}`} className="leading-snug">{ach}</li>
                ))}
              </ul>
            )}
            {data.languages && data.languages.length > 0 && (
              <div className="pt-0.5">
                <span className="font-bold text-black">Languages: </span>
                <span>{data.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
