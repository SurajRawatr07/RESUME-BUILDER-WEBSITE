import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface SoftwareEngineerTemplateProps {
  data: ResumeData;
}

export default function SoftwareEngineerTemplate({ data }: SoftwareEngineerTemplateProps) {
  rta.email}</span>
          <span>•</span>
          <span>{data.phone}</span>
          <span>•</span>
          <span>{data.location}</span>
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-300">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience First (Corporate Standard) */}
        {data.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-300">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-sm text-gray-600">
                        {exp.company} {exp.location && `| ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-300">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.technologies.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">Technologies</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.technologies.join(', ')}
                </p>
              </div>
            )}
            {data.skills.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">Core Skills</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.skills.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-300">
              Key Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{proj.technologies}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 pb-1 border-b border-gray-300">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">
                        {edu.institution} {edu.location && `| ${edu.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(edu.graduationDate)}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-300">
                Certifications
              </h3>
              <div className="space-y-2">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.issuer} • {formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-300">
                Achievements
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.achievements.slice(0, 4).map((achievement, idx) => (
                  <li key={idx} className="text-xs">• {achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 pb-1 border-b border-gray-300">
              Languages
            </h3>
            <p className="text-sm text-gray-700">
              {data.languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
