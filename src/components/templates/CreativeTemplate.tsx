import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';
sName="text-sm text-teal-600 font-medium">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-2 bg-white rounded"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="space-y-4 pl-10">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mb-1">{proj.technologies}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Technologies */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Skills & Technologies</h2>
          </div>
          <div className="pl-10 space-y-3">
            {data.skills.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Core Skills</p>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.technologies.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {data.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="space-y-3 pl-10">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">
                        {edu.institution} {edu.location && `• ${edu.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(edu.graduationDate)}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Certifications</h3>
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

          {/* Languages */}
          {data.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Languages</h3>
              <div className="space-y-1">
                {data.languages.map((lang) => (
                  <p key={lang.id} className="text-sm text-gray-700">
                    {lang.language} - {lang.proficiency}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Achievements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {data.achievements.map((achievement, idx) => (
                <li key={idx} className="flex">
                  <span className="text-teal-500 mr-2">▸</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests */}
        {data.interests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Interests</h3>
            <p className="text-sm text-gray-700">{data.interests.join(' • ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
