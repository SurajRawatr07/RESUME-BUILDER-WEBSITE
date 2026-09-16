import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function FullStackTemplate({ data }: TemplateProps) {
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
      {/* 1. FULL STACK HEADER */}
      <header className="border-b-2 border-black pb-2 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
          <div>
            <h1 className="text-[22pt] font-bold uppercase tracking-tight text-black">
              {data.fullName || 'Suraj Rawat'}
            </h1>
            <p className="text-[10pt] font-bold text-gray-800 tracking-wide">
              {data.jobTitle || 'Full Stack Software Engineer'}
            </p>
          </div>
          <div className="text-[8.5pt] text-gray-800 flex flex-wrap items-center gap-x-2 sm:justify-end">
            <ContactItem type="location" value={data.location} />
            {data.location && data.phone && <span>|</span>}
            <ContactItem type="phone" value={data.phone} />
            {data.phone && data.email && <span>|</span>}
            <ContactItem type="email" value={data.email} />
          </div>
        </div>

        {/* Second contact row for profiles */}
        <div className="text-[8.5pt] text-gray-800 flex flex-wrap items-center gap-x-2.5 mt-1 border-t border-gray-300 pt-1">
          <ContactItem type="github" value={data.github} />
          {data.github && data.linkedin && <span>•</span>}
          <ContactItem type="linkedin" value={data.linkedin} />
          {data.linkedin && (data.portfolio || data.website) && <span>•</span>}
          <ContactItem type="portfolio" value={data.portfolio || data.website} />
          {(data.portfolio || data.website) && data.leetcode && <span>•</span>}
          <ContactItem type="leetcode" value={data.leetcode} />
        </div>
      </header>

      {/* 2. TECHNICAL COMPETENCIES (Full-Stack 4-Quadrant Balance) */}
      <section className="mb-2.5">
        <h2 className="text-[10.5pt] font-bold tracking-wider uppercase border-b border-black pb-0.5 mb-1.5 text-black">
          Technical Stack & Competencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[8.5pt] leading-snug">
          <div>
            <span className="font-bold text-black">Frontend Technologies: </span>
            <span className="text-gray-900">{cat.frontend.length > 0 ? cat.frontend.join(', ') : 'React, Next.js, TypeScript, Tailwind CSS, Redux'}</span>
          </div>
          <div>
            <span className="font-bold text-black">Backend & APIs: </span>
            <span className="text-gray-900">{cat.backend.length > 0 ? cat.backend.join(', ') : 'Node.js, Express, REST APIs, GraphQL, WebSockets'}</span>
          </div>
          <div>
            <span className="font-bold text-black">Databases & Caching: </span>
            <span className="text-gray-900">{cat.databases.length > 0 ? cat.databases.join(', ') : 'PostgreSQL, MongoDB, Redis, Prisma ORM'}</span>
          </div>
          <div>
            <span className="font-bold text-black">DevOps & Cloud: </span>
            <span className="text-gray-900">{cat.tools.length > 0 ? cat.tools.join(', ') : 'Docker, AWS, Git, GitHub Actions, Linux'}</span>
          </div>
        </div>
      </section>

      {/* 3. WORK EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10.5pt] font-bold tracking-wider uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            Work Experience
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

      {/* 4. FULL-STACK PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10.5pt] font-bold tracking-wider uppercase border-b border-black pb-0.5 mb-1.5 text-black">
            End-to-End Projects
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
                          ({proj.technologies})
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <ContactItem
                        type="github"
                        value={proj.link}
                        className="text-[8pt] text-gray-800 hover:underline font-medium"
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

      {/* 5. EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[10.5pt] font-bold tracking-wider uppercase border-b border-black pb-0.5 mb-1 text-black">
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

      {/* 6. ACHIEVEMENTS & CERTIFICATIONS */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10.5pt] font-bold tracking-wider uppercase border-b border-black pb-0.5 mb-1 text-black">
            Achievements & Recognition
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
