import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function FAANGPathTemplate({ data }: TemplateProps) {
  const cat = categorizeSkills(data);

  return (
    <div
      className="w-full bg-white text-black p-6 sm:p-7 md:p-8 mx-auto box-border print:p-0 print:shadow-none"
      style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '9pt',
        lineHeight: '1.32',
        color: '#000000',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 1. FAANGPATH CLASSIC MINIMAL CENTERED HEADER */}
      <header className="text-center pb-1.5 mb-1.5 border-b border-black">
        <h1 className="text-[22pt] font-normal tracking-wide uppercase leading-none mb-1 text-black">
          {data.fullName || 'Suraj Rawat'}
        </h1>
        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.email && (
            <span>
              • <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a>
            </span>
          )}
          {data.linkedin && (
            <span>
              • <a href={`https://${cleanUrl(data.linkedin)}`} target="_blank" rel="noreferrer" className="text-black hover:underline">LinkedIn</a>
            </span>
          )}
          {data.github && (
            <span>
              • <a href={`https://${cleanUrl(data.github)}`} target="_blank" rel="noreferrer" className="text-black hover:underline">GitHub</a>
            </span>
          )}
          {data.leetcode && (
            <span>
              • <a href={`https://${cleanUrl(data.leetcode)}`} target="_blank" rel="noreferrer" className="text-black hover:underline">LeetCode (1566)</a>
            </span>
          )}
          {data.portfolio && (
            <span>
              • <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="text-black hover:underline">Portfolio</a>
            </span>
          )}
        </div>
      </header>

      {/* 2. EDUCATION (TOP PLACEMENT - STANDARD FAANG SDE HIERARCHY) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1 text-black">
            Education
          </h2>
          <div className="space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[9pt]">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{edu.institution}</span>
                  <span className="text-[8.5pt] font-normal text-gray-800">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-gray-900 italic">
                  <span>{edu.degree}</span>
                  {edu.gpa && <span className="font-semibold not-italic text-black">CGPA: {edu.gpa}</span>}
                </div>
                {edu.coursework && (
                  <div className="text-[8.5pt] text-gray-800 mt-0.5">
                    <span className="font-semibold not-italic">Relevant Coursework: </span>
                    <span>{edu.coursework}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TECHNICAL SKILLS */}
      <section className="mb-2">
        <h2 className="text-[10pt] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1 text-black">
          Technical Skills
        </h2>
        <div className="text-[8.5pt] leading-tight space-y-0.5">
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
              <span className="font-bold text-black">Developer Tools: </span>
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

      {/* 4. EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1 text-black">
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
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-black">{exp.jobTitle}</span>
                    <span className="text-[8.5pt] text-gray-800">{dateRange}</span>
                  </div>
                  <div className="flex justify-between items-baseline italic text-[8.5pt] text-gray-800 mb-0.5">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
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

      {/* 5. PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10pt] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1 text-black">
            Projects
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
                          {' '} | {proj.technologies}
                        </span>
                      )}
                    </div>
                    {dateRange && <span className="text-[8.5pt] text-gray-800">{dateRange}</span>}
                  </div>
                  {proj.link && (
                    <div className="text-[8pt] text-gray-700">
                      Code: <a href={`https://${cleanUrl(proj.link)}`} target="_blank" rel="noreferrer" className="underline text-black">{cleanUrl(proj.link)}</a>
                    </div>
                  )}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900 mt-0.5">
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

      {/* 6. ACHIEVEMENTS & LEADERSHIP */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <section>
          <h2 className="text-[10pt] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1 text-black">
            Achievements & Leadership
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements?.map((ach, idx) => (
              <li key={`faang-ach-${idx}`} className="leading-snug">{ach}</li>
            ))}
            {data.certifications?.map((cert) => (
              <li key={cert.id} className="leading-snug">
                <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
