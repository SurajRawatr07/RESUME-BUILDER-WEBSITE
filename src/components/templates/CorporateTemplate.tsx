import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface CorporateTemplateProps {
  data:="flex-1 px-10 py-8 space-y-6">

     tyle={{ fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>{data.summary}</p>
        yle={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.experiences.map(exp => (
                  <div key={exp.id} style={{ paddingLeft: '14px', borderLeft: '2px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{exp.jobTitle}</h3>
                        <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>
                          {exp.company}{exp.location && ` • ${exp.location}`}
                        </p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #f59e0b', paddingBottom: '6px', marginBottom: '12px' }}>
                Key Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.projects.map(proj => (
                  <div key={proj.id} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{proj.title}</h3>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{formatDate(proj.startDate)}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginBottom: '4px' }}>{proj.technologies}</p>
                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #f59e0b', paddingBottom: '6px', marginBottom: '10px' }}>
                Key Achievements
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', marginTop: '5px', flexShrink: 0 }} />
                    <p style={{ fontSize: '12.5px', color: '#475569' }}>{a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '220px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '2px solid #f59e0b', paddingBottom: '4px' }}>
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{edu.degree}</p>
                    <p style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>{edu.institution}</p>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>{formatDate(edu.graduationDate)}{edu.gpa && ` · GPA ${edu.gpa}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '2px solid #f59e0b', paddingBottom: '4px' }}>
                Core Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data.skills.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '5px', height: '5px', background: '#f59e0b', borderRadius: '50%' }} />
                    <span style={{ fontSize: '11.5px', color: '#334155' }}>{s}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technologies */}
          {data.technologies.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '2px solid #f59e0b', paddingBottom: '4px' }}>
                Technologies
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {data.technologies.map((t, i) => (
                  <span key={i} style={{ fontSize: '10px', background: '#e2e8f0', color: '#334155', padding: '2px 7px', borderRadius: '4px', fontWeight: 500 }}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '2px solid #f59e0b', paddingBottom: '4px' }}>
                Certifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.certifications.map(cert => (
                  <div key={cert.id}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{cert.name}</p>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>{cert.issuer} · {formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '2px solid #f59e0b', paddingBottom: '4px' }}>
                Languages
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data.languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{l.language}</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
