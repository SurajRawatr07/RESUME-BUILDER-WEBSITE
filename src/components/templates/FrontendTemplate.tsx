import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface FrontendTemplateProps {
  data: ReName="w-1 h-1 bg-indigo-500 rounded-full"></span>
            {data.phone}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
            {data.location}
          </span>
        </div>
      </div>

      {/* About Me / Summary */}
      {(data.aboutMe || data.summary) && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            About Me
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.aboutMe || data.summary}
          </p>
        </div>
      )}

      {/* Frontend Technologies (Highlighted) */}
      {data.technologies.length > 0 && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            Frontend Technologies
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {data.technologies.map((tech, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded text-sm font-medium text-indigo-700 text-center"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects (UI-Centric) */}
      {data.projects.length > 0 && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            UI Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-r">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">{proj.title}</h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </p>
                </div>
                <p className="text-xs text-indigo-600 mb-2 font-medium">
                  Tech Stack: {proj.technologies}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{proj.description}</p>
                {proj.link && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Link:</span> {proj.link}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company} {exp.location && `• ${exp.location}`}
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

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            Core Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-7">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-indigo-500"></span>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
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

      {/* Bottom Sections in Two Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Certifications</h3>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Achievements</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {data.achievements.slice(0, 3).map((achievement, idx) => (
                <li key={idx} className="text-xs">• {achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
