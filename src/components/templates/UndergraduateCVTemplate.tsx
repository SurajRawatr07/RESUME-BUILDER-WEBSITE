import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets, cleanUrl } from './templateUtils';

interface TemplateProps {
  data: ResumeData;
}

export default function UndergraduateCVTemplate({ data }: TemplateProps) {
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
      {/* 1. ACADEMIC & STUDENT CV HEADER */}
      <header className="border-b-2 border-black pb-2 mb-2 text-center">
        <h1 className="text-[22pt] font-bold tracking-normal uppercase text-black leading-none mb-1">
          {data.fullName || 'Suraj Rawat'}
        </h1>
        <div className="text-[9.5pt] font-semibold text-gray-800 tracking-wide mb-1">
          Undergraduate Computer Applications Candidate • Software Engineer
        </div>
        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
          <span>{data.location}</span>
          <span>• Phone: {data.phone}</span>
          <span>• Email: <a href={`mailto:${data.email}`} className="text-black hover:underline">{data.email}</a></span>
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
          {data.portfolio && (
            <span>• Web: <a href={`https://${cleanUrl(data.portfolio)}`} target="_blank" rel="noreferrer" className="text-black underline">{cleanUrl(data.portfolio)}</a></span>
          )}
        </div>
      </header>

      {/* 2. EDUCATION PROMINENTLY AT TOP (ACADEMIC / FRESHER SPECIFICATION) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Education
          </h2>
          <div className="space-y-1">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[9pt]">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{edu.institution}, {edu.location}</span>
                  <span className="text-[8.5pt] font-normal text-gray-800">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-gray-900">
                  <span className="italic font-semibold">{edu.degree}</span>
                  {edu.gpa && <span className="font-bold text-black">CGPA: {edu.gpa}</span>}
                </div>
                {edu.coursework && (
                  <div className="text-[8.5pt] text-gray-800 mt-0.5">
                    <span className="font-semibold">Relevant Coursework: </span>
                    {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TECHNICAL SKILLS */}
      <section className="mb-2">
        <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
          Technical Skills
        </h2>
        <div className="text-[8.5pt] leading-tight space-y-0.5">
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Programming Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {cat.frontend.length > 0 && (
            <div>
              <span className="font-bold text-black">Web & Frontend: </span>
              <span className="text-gray-900">{cat.frontend.join(', ')}</span>
            </div>
          )}
          {cat.backend.length > 0 && (
            <div>
              <span className="font-bold text-black">Backend & REST APIs: </span>
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
              <span className="font-bold text-black">Tools & Technologies: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
          {cat.coreCS.length > 0 && (
            <div>
              <span className="font-bold text-black">CS Core: </span>
              <span className="text-gray-900">{cat.coreCS.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. KEY PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Academic & Software Projects
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

      {/* 5. EXPERIENCE & INTERNSHIPS */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Internships & Experience
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
                    <span>{exp.jobTitle} <span className="font-normal text-gray-700">({exp.company})</span></span>
                    <span className="text-[8.5pt] font-normal text-gray-800">{dateRange}</span>
                  </div>
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

      {/* 6. COMPETITIONS & ACHIEVEMENTS */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Competitions & Achievements
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.achievements.map((ach, idx) => (
              <li key={`ug-ach-${idx}`} className="leading-snug">{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. LEADERSHIP & CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-black">
            Certifications & Training
          </h2>
          <ul className="list-disc pl-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.certifications.map((cert) => (
              <li key={cert.id} className="leading-snug">
                <span className="font-semibold text-black">{cert.name}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
