import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface MinimalTemplateProps {
  data: ResumeData;
}3 className="text-base font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
          ame="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(edu.graduationDate)}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {edu.institution} {edu.location && `• ${edu.location}`}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{proj.title}</h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-1">{proj.technologies}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Technologies */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
          Skills & Technologies
        </h2>
        <div className="space-y-2">
          {data.skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Skills:</p>
              <p className="text-sm text-gray-700">{data.skills.join(' • ')}</p>
            </div>
          )}
          {data.technologies.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Technologies:</p>
              <p className="text-sm text-gray-700">{data.technologies.join(' • ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
                <p className="text-xs text-gray-500">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
            Achievements
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {data.achievements.map((achievement, idx) => (
              <li key={idx}>• {achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages & Interests */}
      <div className="grid grid-cols-2 gap-6">
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang) => (
                <p key={lang.id} className="text-sm text-gray-700">
                  {lang.language} <span className="text-gray-500">({lang.proficiency})</span>
                </p>
              ))}
            </div>
          </div>
        )}
        {data.interests.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
              Interests
            </h2>
            <p className="text-sm text-gray-700">{data.interests.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
