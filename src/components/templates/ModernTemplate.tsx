import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface ModernTemplateProps {
  data: ResumeData;
}
 classNam]className="text-white">{data.location}</p>
            </div>
          </div>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {data.technologies.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider mb-3">Technologies</h2>
              <div className="space-y-1 text-sm">
                {data.technologies.map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="w-1 h-1 bg-indigo-300 rounded-full mr-2"></span>
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider mb-3">Languages</h2>
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-sm">
                  <p className="font-medium">{lang.language}</p>
                  <p className="text-indigo-200 text-xs">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {data.interests.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider mb-3">Interests</h2>
              <div className="text-sm space-y-1">
                {data.interests.map((interest, idx) => (
                  <p key={idx}>{interest}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 print:w-[65%]">
        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-indigo-600">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-indigo-600">
              EXPERIENCE
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-sm text-indigo-600 font-medium">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-indigo-600">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </p>
                  </div>
                  <p className="text-xs text-indigo-600 mb-1">{proj.technologies}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                  {proj.link && <p className="text-xs text-gray-500 mt-1">{proj.link}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-indigo-600">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-indigo-600">
                        {edu.institution} {edu.location && `• ${edu.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                      {formatDate(edu.graduationDate)}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-indigo-600">
              CERTIFICATIONS
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                  </div>
                  <p className="text-xs text-gray-600">{formatDate(cert.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-indigo-600">
              ACHIEVEMENTS
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              {data.achievements.map((achievement, idx) => (
                <li key={idx} className="flex">
                  <span className="mr-2">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
