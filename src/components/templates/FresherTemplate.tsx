import React from 'react';
import { ResumeData } from '@/types/resume';
import { categorizeSkills, parseBullets } from './templateUtils';
import { ContactItem } from './common/ContactItem';

interface TemplateProps {
  data: ResumeData;
}

export default function FresherTemplate({ data }: TemplateProps) {
  const cat = categorizeSkills(data);
  const hasAnySkills =
    cat.languages.length > 0 ||
    cat.frontend.length > 0 ||
    cat.backend.length > 0 ||
    cat.databases.length > 0 ||
    cat.tools.length > 0 ||
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
      {/* 1. STUDENT/FRESHER HEADER */}
      <header className="text-center pb-2 mb-2.5 border-b-2 border-black">
        <h1 className="text-[23pt] font-bold tracking-tight uppercase text-black leading-tight break-words">
          {data.fullName || 'Your Name'}
        </h1>
        {data.jobTitle && (
          <div className="text-[9pt] font-semibold text-gray-800 tracking-wide mt-0.5 break-words">
            {data.jobTitle}
          </div>
        )}

        <div className="text-[8.5pt] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 mt-1">
          <ContactItem type="location" value={data.location} />
          {data.location && data.phone && <span aria-hidden="true">•</span>}
          <ContactItem type="phone" value={data.phone} />
          {(data.location || data.phone) && data.email && <span aria-hidden="true">•</span>}
          <ContactItem type="email" value={data.email} />
          {(data.location || data.phone || data.email) && data.github && <span aria-hidden="true">•</span>}
          <ContactItem type="github" value={data.github} />
          {(data.location || data.phone || data.email || data.github) && data.linkedin && (
            <span aria-hidden="true">•</span>
          )}
          <ContactItem type="linkedin" value={data.linkedin} />
          {(data.location || data.phone || data.email || data.github || data.linkedin) && data.leetcode && (
            <span aria-hidden="true">•</span>
          )}
          <ContactItem type="leetcode" value={data.leetcode} />
        </div>
      </header>

      {/* 2. SUMMARY */}
      {(data.summary || data.aboutMe) && (
        <section className="mb-2.5">
          <p className="text-[9pt] text-gray-900 leading-relaxed text-left">
            {data.summary || data.aboutMe}
          </p>
        </section>
      )}

      {/* 3. EDUCATION (First for Fresher/Student) */}
      {data.education && data.education.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2 font-bold text-[9.5pt]">
                  <span className="min-w-0">{edu.institution}</span>
                  <span className="font-normal text-[8.5pt] text-gray-800 shrink-0 text-right">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline gap-2 text-[9pt]">
                  <span className="font-semibold text-gray-900 italic min-w-0">
                    {edu.degree} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                  </span>
                  <span className="text-[8.5pt] text-gray-700 shrink-0 text-right">{edu.graduationDate}</span>
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

      {/* 4. TECHNICAL SKILLS */}
      {hasAnySkills && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
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
                <span className="font-bold text-black">Frameworks &amp; Web: </span>
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
            {(cat.coreCS.length > 0 || cat.ai.length > 0 || cat.other.length > 0) && (
              <div>
                <span className="font-bold text-black">Coursework &amp; Additional Skills: </span>
                <span className="text-gray-900">
                  {[...cat.coreCS, ...cat.ai, ...cat.other].join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. ACADEMIC & SOFTWARE PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
            Featured Projects
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

      {/* 6. INTERNSHIPS / EXPERIENCE */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1.5 text-black break-after-avoid print:break-after-avoid">
            Experience &amp; Internships
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

      {/* 7. CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black break-after-avoid print:break-after-avoid">
            Certifications
          </h2>
          <div className="space-y-0.5 text-[8.5pt] text-gray-900">
            {data.certifications.map((c) => (
              <div key={c.id} className="flex justify-between gap-2 break-inside-avoid print:break-inside-avoid">
                <span className="min-w-0">• <span className="font-semibold">{c.name}</span> — {c.issuer}</span>
                <span className="text-gray-600 shrink-0 text-right">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. ACHIEVEMENTS & EXTRACURRICULARS */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <h2 className="text-[10pt] font-bold tracking-widest uppercase border-b border-black pb-0.5 mb-1 text-black break-after-avoid print:break-after-avoid">
            Honors &amp; Extracurricular Leadership
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
