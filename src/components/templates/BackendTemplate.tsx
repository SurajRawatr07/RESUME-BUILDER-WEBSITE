import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface BackendTemplateProps {
  data: ResumeData;
}

export default function BackendTemplate({ data }: BackendTemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-900 p-10 print:p-10">
      {/* Professional Header */}
      <div className="mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.fullName}</h1>
        <p className="text-lg text-gray-700 font-medium mb-3">{data.jobTitle}</p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Email: {data.email} | Phone: {data.phone} | Location: {data.location}</p>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed pl-5">{data.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {data.technologies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Backend Technologies & Tools
          </h2>
          <div className="pl-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.technologies.join(' • ')}
            </p>
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-l-4 border-gray-800 pl-3">
            Professional Experience
          </h2>
          <div className="space-y-4 pl-5">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {exp.company} {exp.location && `| ${exp.location}`}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backend Projects / System Design */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-l-4 border-gray-800 pl-3">
            Backend Projects & Architecture
          </h2>
          <div className="space-y-4 pl-5">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                  <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </p>
                </div>
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Technologies: {proj.technologies}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                {proj.link && (
                  <p className="text-xs text-gray-500 mt-1">Repository: {proj.link}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-l-4 border-gray-800 pl-3">
            Education
          </h2>
          <div className="space-y-3 pl-5">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution} {edu.location && `| ${edu.location}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 whitespace-nowrap ml-4">
                    {formatDate(edu.graduationDate)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Certifications
          </h2>
          <div className="space-y-2 pl-5">
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

      {/* Additional Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Core Competencies
          </h2>
          <div className="pl-5">
            <p className="text-sm text-gray-700">{data.skills.join(' • ')}</p>
          </div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Key Achievements
          </h2>
          <ul className="text-sm text-gray-700 space-y-1 pl-5">
            {data.achievements.map((achievement, idx) => (
              <li key={idx}>• {achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase mb-2 border-l-4 border-gray-800 pl-3">
            Languages
          </h2>
          <div className="pl-5">
            <p className="text-sm text-gray-700">
              {data.languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
