import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function FresherTemplate({ data }: TemplateProps) {
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
      {/* 1. STUDENT/FRESHER HEADER */}
      <header className="text-center pb-2 mb-2 border-b-2 border-black">
        <h1 className="text-[23pt] font-bold tracking-tight uppercase text-black leading-tight">
          {data.fullName || 'Suraj Rawat'}
        </h1>
        <div className="text-[9pt] font-semibold text-gray-800 tracking-wide mt-0.5">
          {data.jobTitle || 'Computer Science Graduate • Aspiring Software Engineer'}
        </div>

        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 mt-1">
          <ContactItem type="location" value={data.location} />
          {data.location && data.phone && <span>•</span>}
          <ContactItem type="phone" value={data.phone} />
          {data.phone && data.email && <span>•</span>}
          <ContactItem type="email" value={data.email} />
          {data.email && data.github && <span>•</span>}
          <ContactItem type="github" value={data.github} />
          {data.github && data.linkedin && <span>•</span>}
          <ContactItem type="linkedin" value={data.linkedin} />
          {data.linkedin && data.leetcode && <span>•</span>}
          <ContactItem type="leetcode" value={data.leetcode} />
        </div>
      </header>

      {/* 2. EDUCATION (First for Fresher/Student) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-[9.5pt]">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-[8.5pt] text-gray-800">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-[9pt]">
                  <span className="font-semibold text-gray-900 italic">
                    {edu.degree} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </span>
                  <span className="text-[8.5pt] text-gray-700">{edu.graduationDate}</span>
                </div>
                {edu.coursework && (
                  <p className="text-[8.5pt] text-gray-900 mt-0.5">
                    <span className="font-bold">Relevant Coursework: </span>{edu.coursework}
                  </p>
                )}
                {edu.description && !edu.coursework && (
                  <p className="text-[8.5pt] text-gray-800 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TECHNICAL SKILLS */}
      <section className="mb-2.5">
        <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
          Technical Skills
        </h2>
        <div className="space-y-0.5 text-[9pt] leading-snug">
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {(cat.frontend.length > 0 || cat.backend.length > 0) && (
            <div>
              <span className="font-bold text-black">Frameworks & Web: </span>
              <span className="text-gray-900">{[...cat.frontend, ...cat.backend].join(', ')}</span>
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
        </div>
      </section>

      {/* 4. ACADEMIC & SOFTWARE PROJECTS (Dominant for fresher) */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Featured Projects
          </h2>
          <div className="space-y-2">
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

      {/* 5. INTERNSHIPS / EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Experience & Internships
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

      {/* 6. ACHIEVEMENTS & EXTRACURRICULARS */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            Honors & Extracurricular Leadership
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
