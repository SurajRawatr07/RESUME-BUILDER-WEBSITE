import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function SWEResumeTemplate({ data }: TemplateProps) {
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
      {/* 1. ASYMMETRICAL LEFT-ALIGNED FULL STACK HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-black pb-2 mb-2">
        <div>
          <h1 className="text-[22pt] font-bold tracking-tight text-black leading-none">
            {data.fullName || 'Suraj Rawat'}
          </h1>
          <div className="text-[10pt] font-semibold text-gray-800 tracking-wide mt-1">
            {data.jobTitle || 'Software Engineer'} | Full Stack Developer
          </div>
          <div className="text-[8.5pt] text-gray-700 mt-0.5">
            {data.location || 'Haldwani, Uttarakhand, India'}
          </div>
        </div>

        <div className="text-[8.5pt] text-gray-800 text-left sm:text-right mt-2 sm:mt-0 space-y-0.5">
          <div>
            <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a>
            {data.phone && <span> • {data.phone}</span>}
          </div>
          <div className="flex sm:justify-end gap-2 flex-wrap">
            {data.github && (
              <a href={`https://${cleanUrl(data.github)}`} target="_blank" rel="noreferrer" className="underline text-black">
                GitHub: {cleanUrl(data.github)}
              </a>
            )}
            {data.linkedin && (
              <span>
                • <a href={`https://${cleanUrl(data.linkedin)}`} target="_blank" rel="noreferrer" className="underline text-black">
                  LinkedIn
                </a>
              </span>
            )}
            {data.leetcode && (
              <span>
                • <a href={`https://${cleanUrl(data.leetcode)}`} target="_blank" rel="noreferrer" className="underline text-black">
                  LeetCode
                </a>
              </span>
            )}
          </div>
          {data.portfolio && (
            <div>
              Portfolio:{' '}
              <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="underline text-black">
                {cleanUrl(data.portfolio)}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 2. TECHNICAL SKILLS PLACED PROMINENTLY AT TOP (FULL STACK SWE FOCUS) */}
      <section className="mb-2">
        <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-black">
          Technical Competencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[9pt] leading-snug">
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {cat.frontend.length > 0 && (
            <div>
              <span className="font-bold text-black">Frontend: </span>
              <span className="text-gray-900">{cat.frontend.join(', ')}</span>
            </div>
          )}
          {cat.backend.length > 0 && (
            <div>
              <span className="font-bold text-black">Backend: </span>
              <span className="text-gray-900">{cat.backend.join(', ')}</span>
            </div>
          )}
          {cat.databases.length > 0 && (
            <div>
              <span className="font-bold text-black">Databases: </span>
              <span className="text-gray-900">{cat.databases.join(', ')}</span>
            </div>
          )}
          {cat.tools.length > 0 && (
            <div>
              <span className="font-bold text-black">Tools & Cloud: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
          {cat.coreCS.length > 0 && (
            <div>
              <span className="font-bold text-black">Core CS: </span>
              <span className="text-gray-900">{cat.coreCS.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. PROFESSIONAL EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-black">
            Engineering Experience
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
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">
                      {exp.jobTitle} <span className="font-normal text-gray-700">| {exp.company}</span>
                    </span>
                    <span className="text-[8.5pt] font-medium text-gray-800">{dateRange}</span>
                  </div>
                  {exp.location && (
                    <div className="text-[8pt] text-gray-600 italic -mt-0.5 mb-0.5">{exp.location}</div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-900">
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

      {/* 4. CORE FULL STACK PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-black">
            Core Projects
          </h2>
          <div className="space-y-1.5">
            {data.projects.map((proj) => {
              const bullets = parseBullets(proj.description);
              const dateRange = proj.endDate
                ? `${proj.startDate} – ${proj.endDate}`
                : proj.startDate;

              return (
                <div key={proj.id} className="text-[9pt]">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-black">{proj.title}</span>
                      {proj.technologies && (
                        <span className="text-gray-700 italic text-[8.5pt]">
                          {' '}– ({proj.technologies})
                        </span>
                      )}
                    </div>
                    {dateRange && <span className="text-[8.5pt] text-gray-800">{dateRange}</span>}
                  </div>
                  {proj.link && (
                    <div className="text-[8pt] text-gray-700">
                      Repo:{' '}
                      <a href={`https://${cleanUrl(proj.link)}`} target="_blank" rel="noreferrer" className="underline text-black">
                        {cleanUrl(proj.link)}
                      </a>
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-900 mt-0.5">
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

      {/* 5. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-black">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="text-[9pt]">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black">{edu.institution}</span>
                <span className="text-[8.5pt] text-gray-800">{edu.graduationDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-gray-900">
                <span className="italic">{edu.degree}</span>
                {edu.gpa && <span className="font-semibold text-black">{edu.gpa}</span>}
              </div>
              {edu.coursework && (
                <div className="text-[8.5pt] text-gray-800 mt-0.5">
                  <span className="font-semibold">Relevant Coursework: </span>
                  {edu.coursework}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 6. ACHIEVEMENTS & CONTRIBUTIONS */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <section>
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-black">
            Key Achievements & Certifications
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements?.map((ach, idx) => (
              <li key={`ach-${idx}`} className="leading-snug">{ach}</li>
            ))}
            {data.certifications?.map((cert) => (
              <li key={cert.id} className="leading-snug">
                <span className="font-semibold">{cert.name}</span> – {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
