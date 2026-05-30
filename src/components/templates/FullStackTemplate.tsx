import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface FullStackTemplateProps {
  data: ResumeData;
}tack
          </h2>
          <div className="grid grid-cols-2 gap-4 pl-3">
            {/* Frontend Stack */}
            {frontendTech.length > 0 && (
              <div className="border-l-2 border-blue-400 pl-3">
                <h3 className="text-sm font-bold text-blue-600 mb-2">Frontend</h3>
                <div className="flex flex-wrap gap-1.5">
                  {frontendTech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Backend Stack */}
            {backendTech.length > 0 && (
              <div className="border-l-2 border-teal-400 pl-3">
                <h3 className="text-sm font-bold text-teal-600 mb-2">Backend</h3>
                <div className="flex flex-wrap gap-1.5">
                  {backendTech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Other Technologies */}
            {otherTech.length > 0 && (
              <div className="col-span-2 border-l-2 border-gray-400 pl-3">
                <h3 className="text-sm font-bold text-gray-600 mb-2">Tools & Others</h3>
                <div className="flex flex-wrap gap-1.5">
                  {otherTech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projects (Project-Centric) */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600"></span>
              Full-Stack Projects
            </h2>
            <div className="space-y-4 pl-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </p>
                  </div>
                  <p className="text-xs font-medium mb-1">
                    <span className="text-blue-600">Tech:</span> {proj.technologies}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                  {proj.link && (
                    <p className="text-xs text-gray-500 mt-1">🔗 {proj.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-teal-600"></span>
              Professional Experience
            </h2>
            <div className="space-y-4 pl-3">
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

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600"></span>
              Education
            </h2>
            <div className="space-y-3 pl-3">
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

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase mb-2">Skills</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {data.skills.join(', ')}
              </p>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase mb-2">Certifications</h3>
              {data.certifications.slice(0, 2).map((cert) => (
                <p key={cert.id} className="text-xs text-gray-700 mb-1">
                  {cert.name}
                </p>
              ))}
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase mb-2">Languages</h3>
              <p className="text-xs text-gray-700">
                {data.languages.map(l => l.language).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-teal-600"></span>
              Key Achievements
            </h2>
            <ul className="text-sm text-gray-700 space-y-1 pl-3">
              {data.achievements.slice(0, 3).map((achievement, idx) => (
                <li key={idx}>• {achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
