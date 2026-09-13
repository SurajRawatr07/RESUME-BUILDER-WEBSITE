import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function CSITTemplate({ data }: TemplateProps) {
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
      {/* 1. CS/IT HEADER */}
      <header className="border-b-2 border-black pb-2 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
          <div>
            <h1 className="text-[22pt] font-bold uppercase tracking-tight text-black">
              {data.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-[10pt] font-bold text-gray-800 tracking-wide">
              {data.jobTitle || 'Computer Science & Information Technology Engineer'}
            </p>
          </div>
          <div className="text-[8.5pt] text-gray-800 flex flex-col items-start sm:items-end gap-0.5">
            <div className="flex items-center gap-2">
              <ContactItem type="location" value={data.location} />
              {data.location && data.phone && <span>•</span>}
              <ContactItem type="phone" value={data.phone} />
            </div>
            <div className="flex items-center gap-2">
              <ContactItem type="email" value={data.email} />
              {data.email && data.github && <span>•</span>}
              <ContactItem type="github" value={data.github} />
            </div>
            <div className="flex items-center gap-2">
              <ContactItem type="linkedin" value={data.linkedin} />
              {data.linkedin && data.leetcode && <span>•</span>}
              <ContactItem type="leetcode" value={data.leetcode} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. EDUCATION & ACADEMIC BACKGROUND (First for CS/IT) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Education & Academic Credentials
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-[9.5pt]">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-[8.5pt] text-gray-800">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-[9pt] italic">
                  <span>{edu.degree} {edu.gpa ? `— GPA: ${edu.gpa}` : ''}</span>
                  <span className="font-normal text-[8.5pt] text-gray-700 not-italic">{edu.graduationDate}</span>
                </div>
                {edu.coursework && (
                  <p className="text-[8.5pt] text-gray-900 mt-0.5">
                    <span className="font-bold">Core Computer Science Coursework: </span>
                    {edu.coursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TECHNICAL & CORE CS SKILLS */}
      <section className="mb-2.5">
        <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
          Technical Competencies & Systems
        </h2>
        <div className="space-y-0.5 text-[9pt] leading-snug">
          <div>
            <span className="font-bold text-black">Core CS Foundations: </span>
            <span className="text-gray-900">
              {cat.coreCS.length > 0
                ? cat.coreCS.join(', ')
                : 'Data Structures & Algorithms, Object-Oriented Design, Operating Systems, Computer Networks, DBMS'}
            </span>
          </div>
          {cat.languages.length > 0 && (
            <div>
              <span className="font-bold text-black">Programming Languages: </span>
              <span className="text-gray-900">{cat.languages.join(', ')}</span>
            </div>
          )}
          {(cat.frontend.length > 0 || cat.backend.length > 0) && (
            <div>
              <span className="font-bold text-black">Web & Software Engineering: </span>
              <span className="text-gray-900">{[...cat.frontend, ...cat.backend].join(', ')}</span>
            </div>
          )}
          {cat.databases.length > 0 && (
            <div>
              <span className="font-bold text-black">Database Systems: </span>
              <span className="text-gray-900">{cat.databases.join(', ')}</span>
            </div>
          )}
          {cat.tools.length > 0 && (
            <div>
              <span className="font-bold text-black">Development Tools: </span>
              <span className="text-gray-900">{cat.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. TECHNICAL PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Engineering & Software Projects
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

      {/* 5. EXPERIENCE */}
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
                      {exp.jobTitle}
                    </span>
                    <span className="text-[8.5pt] text-gray-700">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="italic text-[9pt] text-gray-900">
                      {exp.company}
                    </span>
                    <span className="text-[8.5pt] text-gray-700 italic">
                      {exp.location}
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

      {/* 6. ACHIEVEMENTS & CERTIFICATIONS */}
      {((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <section>
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black">
            Certifications & Honors
          </h2>
          <ul className="list-disc ml-4 space-y-0.5 text-[8.5pt] text-gray-900">
            {data.certifications?.map((c) => (
              <li key={c.id} className="leading-snug">
                <span className="font-semibold">{c.name}</span> — {c.issuer} ({c.date})
              </li>
            ))}
            {data.achievements?.map((ach, idx) => (
              <li key={idx} className="leading-snug">{ach}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
