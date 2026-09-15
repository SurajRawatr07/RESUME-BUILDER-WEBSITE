import { ResumeData } from '@/types/resume';

export interface ATSSectionScore {
  score: number;
  max: number;
  label: string;
  feedback: string;
}

export interface ATSAnalysisResult {
  score: number;
  status: 'Needs Improvement' | 'Fair' | 'Good' | 'Strong' | 'Excellent';
  statusColor: string;
  targetRole: string;
  breakdown: {
    contact: ATSSectionScore;
    summary: ATSSectionScore;
    skills: ATSSectionScore;
    experience: ATSSectionScore;
    projects: ATSSectionScore;
    education: ATSSectionScore;
    achievements: ATSSectionScore;
    certifications: ATSSectionScore;
    keywords: ATSSectionScore;
    formatting: ATSSectionScore;
  };
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  recommendations: string[];
}

export const ROLE_KEYWORD_DICTIONARIES: Record<string, string[]> = {
  'Frontend Developer': [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind',
    'Next.js', 'Redux', 'REST API', 'GraphQL', 'Responsive Design',
    'Git', 'Webpack', 'Vite', 'Testing', 'Jest', 'Accessibility', 'UI/UX'
  ],
  'Backend Developer': [
    'Node.js', 'Express', 'REST API', 'MongoDB', 'PostgreSQL', 'SQL',
    'Authentication', 'JWT', 'Docker', 'Microservices', 'Python', 'Java',
    'Redis', 'API Design', 'Database', 'Git', 'Linux', 'AWS'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Express', 'MongoDB',
    'PostgreSQL', 'REST API', 'Git', 'Docker', 'Tailwind', 'Next.js',
    'State Management', 'Database', 'Cloud', 'CI/CD'
  ],
  'Software Engineer': [
    'Data Structures', 'Algorithms', 'TypeScript', 'Python', 'Java', 'C++',
    'OOP', 'System Design', 'Git', 'Unit Testing', 'Debugging', 'REST API',
    'Agile', 'SQL', 'Problem Solving', 'Linux'
  ],
  'React Developer': [
    'React', 'Hooks', 'Redux', 'TypeScript', 'JavaScript', 'Next.js',
    'Context API', 'Tailwind CSS', 'Component Lifecycle', 'State Management',
    'Jest', 'React Router', 'HTML5', 'CSS3', 'REST API'
  ],
  'Node.js Developer': [
    'Node.js', 'Express', 'JavaScript', 'TypeScript', 'Asynchronous',
    'MongoDB', 'PostgreSQL', 'REST API', 'Microservices', 'JWT',
    'Redis', 'Docker', 'Event Loop', 'Testing', 'Git'
  ],
  'Java Developer': [
    'Java', 'Spring Boot', 'Spring MVC', 'Hibernate', 'JPA', 'Maven',
    'SQL', 'MySQL', 'PostgreSQL', 'Microservices', 'REST API', 'JUnit',
    'Multi-threading', 'Git', 'Docker'
  ],
  'Python Developer': [
    'Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'SQL',
    'REST API', 'Pandas', 'NumPy', 'Docker', 'Git', 'Linux',
    'Celery', 'Automation', 'Unit Testing'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'AWS', 'Linux',
    'Terraform', 'Bash', 'Prometheus', 'Grafana', 'Nginx', 'Infrastructure',
    'Git', 'Cloud', 'Security'
  ],
  'Data Analyst': [
    'SQL', 'Python', 'Excel', 'Pandas', 'Tableau', 'Power BI',
    'Data Visualization', 'Statistical Analysis', 'ETL', 'Data Cleaning',
    'Reporting', 'Business Intelligence', 'A/B Testing'
  ],
  'Mobile Developer': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
    'Mobile UI', 'REST API', 'State Management', 'Git', 'App Store', 'Google Play'
  ],
  'AI / ML Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow',
    'Scikit-Learn', 'Pandas', 'NumPy', 'Data Preprocessing', 'Model Training',
    'NLP', 'Computer Vision', 'Git', 'Docker'
  ]
};

const ACTION_VERBS = [
  'developed', 'engineered', 'architected', 'implemented', 'designed',
  'built', 'created', 'optimized', 'accelerated', 'reduced', 'improved',
  'streamlined', 'enhanced', 'deployed', 'automated', 'integrated',
  'spearheaded', 'managed', 'led', 'delivered', 'collaborated', 'solved'
];

const METRIC_PATTERN = /(\d+[%kKmMbB+]|\$\d+|\b\d+\s*(?:percent|users|requests|ms|seconds|x|times)\b)/i;

/**
 * Extracts and normalizes all textual content from a ResumeData object.
 */
export function extractResumeText(resume: ResumeData): string {
  if (!resume) return '';

  const parts: string[] = [
    resume.fullName || '',
    resume.jobTitle || '',
    resume.summary || '',
    resume.aboutMe || '',
    ...(resume.skills || []),
    ...(resume.technologies || []),
  ];

  if (resume.experiences) {
    resume.experiences.forEach((exp) => {
      parts.push(exp.jobTitle || '', exp.company || '', exp.description || '');
    });
  }

  if (resume.projects) {
    resume.projects.forEach((proj) => {
      parts.push(
        proj.title || '',
        typeof proj.technologies === 'string' ? proj.technologies : '',
        proj.description || ''
      );
    });
  }

  if (resume.education) {
    resume.education.forEach((edu) => {
      parts.push(
        edu.degree || '',
        edu.institution || '',
        edu.coursework || '',
        edu.description || ''
      );
    });
  }

  if (resume.certifications) {
    resume.certifications.forEach((cert) => {
      if (typeof cert === 'string') {
        parts.push(cert);
      } else if (cert) {
        parts.push(cert.name || '', cert.issuer || '');
      }
    });
  }

  if (resume.achievements) {
    parts.push(...resume.achievements);
  }

  return parts.join(' ').toLowerCase();
}

/**
 * Deterministic ATS Scoring Engine
 * Analyzes resume content across 10 distinct dimensions (Total 100 points).
 */
export function calculateATSScore(
  resume: ResumeData,
  targetRole = 'Full Stack Developer',
  customJobDescription = ''
): ATSAnalysisResult {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  // Default empty checks
  const fullName = (resume?.fullName || '').trim();
  const email = (resume?.email || '').trim();
  const phone = (resume?.phone || '').trim();
  const summary = (resume?.summary || resume?.aboutMe || '').trim();
  const experiences = resume?.experiences || [];
  const projects = resume?.projects || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];
  const certifications = resume?.certifications || [];
  const achievements = resume?.achievements || [];

  // 1. Contact Information (10 Points)
  let contactScore = 0;
  if (fullName.length > 2) contactScore += 2;
  if (email.includes('@') && email.includes('.')) contactScore += 2;
  if (phone.length >= 7) contactScore += 2;
  if ((resume?.linkedin || '').trim().length > 5 || (resume?.github || '').trim().length > 5) contactScore += 2;
  if ((resume?.location || '').trim().length > 2 || (resume?.portfolio || '').trim().length > 5) contactScore += 2;

  if (contactScore >= 8) {
    strengths.push('Complete and professional contact header including direct communication channels.');
  } else {
    weaknesses.push('Incomplete contact details (missing phone, professional profiles, or email).');
    recommendations.push('Add LinkedIn, GitHub, and a valid phone number to ensure recruiters can easily reach you.');
  }

  // 2. Professional Summary (10 Points)
  let summaryScore = 0;
  const summaryWords = summary ? summary.split(/\s+/).filter(Boolean).length : 0;
  if (summaryWords >= 15) summaryScore += 3;
  if (summaryWords >= 30 && summaryWords <= 120) summaryScore += 4;
  else if (summaryWords > 10) summaryScore += 2;
  if (/engineer|developer|specialist|passionate|proven|track record|experienced/i.test(summary)) summaryScore += 3;

  if (summaryScore >= 8) {
    strengths.push('Clear, concise executive summary that articulates professional background.');
  } else if (summaryWords === 0) {
    weaknesses.push('Missing professional summary.');
    recommendations.push('Include a 2-3 sentence executive summary highlighting your domain focus and key skills.');
  } else {
    recommendations.push('Expand your summary with actionable impact and primary technical strengths (30-60 words).');
  }

  // 3. Technical & Professional Skills (15 Points)
  let skillsScore = 0;
  const totalSkills = skills.length + (resume?.technologies || []).length;
  if (totalSkills >= 4) skillsScore += 5;
  if (totalSkills >= 8) skillsScore += 5;
  if (totalSkills >= 12) skillsScore += 5;

  if (totalSkills >= 8) {
    strengths.push(`Rich skill inventory with ${totalSkills} relevant technologies and competencies.`);
  } else {
    weaknesses.push('Limited skill listing may fail ATS keyword filters.');
    recommendations.push('Add core technical skills, frameworks, databases, and developer tools you have used.');
  }

  // 4. Professional Experience (20 Points)
  let experienceScore = 0;
  let actionVerbCount = 0;
  let metricCount = 0;

  if (experiences.length > 0) {
    experienceScore += 5;
    if (experiences.length >= 2) experienceScore += 3;

    experiences.forEach((exp) => {
      const text = `${exp.jobTitle} ${exp.company} ${exp.description}`.toLowerCase();
      ACTION_VERBS.forEach((verb) => {
        if (text.includes(verb)) actionVerbCount++;
      });
      if (METRIC_PATTERN.test(exp.description)) metricCount++;
      if (exp.startDate && (exp.endDate || exp.current)) experienceScore += 1;
    });

    if (actionVerbCount >= 2) experienceScore += 4;
    else if (actionVerbCount >= 1) experienceScore += 2;

    if (metricCount >= 1) experienceScore += 5;
    else if (experiences.some((e) => e.description.length > 80)) experienceScore += 2;
  }
  experienceScore = Math.min(20, experienceScore);

  if (metricCount > 0) {
    strengths.push('Impact-driven work experience backed by quantifiable metrics and outcomes.');
  } else if (experiences.length > 0) {
    weaknesses.push('Experience descriptions lack quantifiable metrics (e.g. %, $, numbers).');
    recommendations.push('Quantify your experience bullets with measurable results (e.g., "improved load time by 35%").');
  } else {
    weaknesses.push('No work experience entries listed.');
    recommendations.push('Include internships, freelance roles, open source work, or contract positions under Experience.');
  }

  // 5. Projects Section (15 Points)
  let projectScore = 0;
  if (projects.length >= 1) projectScore += 5;
  if (projects.length >= 2) projectScore += 4;

  let projectsWithTech = 0;
  let substantiveProjects = 0;
  projects.forEach((proj) => {
    if (proj.technologies && proj.technologies.length > 0) projectsWithTech++;
    if (proj.description && proj.description.length > 40) substantiveProjects++;
  });

  if (projectsWithTech > 0) projectScore += 3;
  if (substantiveProjects > 0) projectScore += 3;
  projectScore = Math.min(15, projectScore);

  if (projects.length >= 2 && projectsWithTech >= 1) {
    strengths.push('Demonstrates practical application through documented projects with defined tech stacks.');
  } else if (projects.length === 0) {
    recommendations.push('Add at least 2 technical projects showcasing your problem-solving capabilities and tech stack.');
  }

  // 6. Education Section (10 Points)
  let educationScore = 0;
  if (education.length > 0) {
    educationScore += 5;
    const hasDegreeAndInst = education.some((e) => e.degree?.length > 2 && e.institution?.length > 2);
    if (hasDegreeAndInst) educationScore += 3;
    if (education.some((e) => e.graduationDate || e.gpa || e.coursework)) educationScore += 2;
  }

  if (educationScore >= 8) {
    strengths.push('Standard academic accreditation with institution and graduation details.');
  } else if (education.length === 0) {
    weaknesses.push('Education section is empty.');
    recommendations.push('List your degree, major, university or bootcamp program, and graduation year.');
  }

  // 7. Achievements (5 Points)
  let achievementsScore = 0;
  if (achievements.length >= 2) achievementsScore = 5;
  else if (achievements.length === 1) achievementsScore = 3;

  // 8. Certifications (5 Points)
  let certificationsScore = 0;
  if (certifications.length >= 2) certificationsScore = 5;
  else if (certifications.length === 1) certificationsScore = 3;

  // 9. Target Role Keywords & Relevance (5 Points)
  const resumeFullText = extractResumeText(resume);
  const targetKeywords = ROLE_KEYWORD_DICTIONARIES[targetRole] || ROLE_KEYWORD_DICTIONARIES['Full Stack Developer'];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach((kw) => {
    const kwLower = kw.toLowerCase();
    if (resumeFullText.includes(kwLower)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const matchRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0;
  let keywordScore = Math.round(matchRatio * 5);
  keywordScore = Math.max(1, Math.min(5, keywordScore));

  if (matchedKeywords.length >= 6) {
    strengths.push(`Strong keyword alignment for ${targetRole} (${matchedKeywords.length} matched).`);
  } else {
    weaknesses.push(`Low keyword density for ${targetRole}.`);
    recommendations.push(`Incorporate key industry terms: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }

  // 10. ATS Formatting & Cleanliness (5 Points)
  let formattingScore = 5;
  if (!fullName) formattingScore -= 2;
  if (experiences.some((e) => !e.jobTitle || !e.company)) formattingScore -= 1;
  if (projects.some((p) => !p.title)) formattingScore -= 1;
  formattingScore = Math.max(1, Math.min(5, formattingScore));

  // Compute Total Score
  const rawTotal =
    contactScore +
    summaryScore +
    skillsScore +
    experienceScore +
    projectScore +
    educationScore +
    achievementsScore +
    certificationsScore +
    keywordScore +
    formattingScore;

  const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));

  // Status computation
  let status: ATSAnalysisResult['status'] = 'Needs Improvement';
  let statusColor = 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800';

  if (totalScore >= 90) {
    status = 'Excellent';
    statusColor = 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800';
  } else if (totalScore >= 75) {
    status = 'Strong';
    statusColor = 'text-indigo-500 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800';
  } else if (totalScore >= 60) {
    status = 'Good';
    statusColor = 'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800';
  } else if (totalScore >= 40) {
    status = 'Fair';
    statusColor = 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800';
  }

  return {
    score: totalScore,
    status,
    statusColor,
    targetRole,
    breakdown: {
      contact: {
        score: contactScore,
        max: 10,
        label: 'Contact Information',
        feedback: contactScore >= 8 ? 'Complete contact details' : 'Add phone, LinkedIn, or location',
      },
      summary: {
        score: summaryScore,
        max: 10,
        label: 'Professional Summary',
        feedback: summaryScore >= 7 ? 'Strong value proposition' : 'Add a 2-3 sentence overview',
      },
      skills: {
        score: skillsScore,
        max: 15,
        label: 'Technical Skills',
        feedback: skillsScore >= 12 ? 'Rich skill coverage' : 'Include more relevant tools and frameworks',
      },
      experience: {
        score: experienceScore,
        max: 20,
        label: 'Work Experience',
        feedback: experienceScore >= 15 ? 'Impact-oriented bullet points' : 'Use action verbs and quantifiable metrics',
      },
      projects: {
        score: projectScore,
        max: 15,
        label: 'Projects',
        feedback: projectScore >= 12 ? 'Projects with defined tech stacks' : 'Document 2+ substantive projects',
      },
      education: {
        score: educationScore,
        max: 10,
        label: 'Education',
        feedback: educationScore >= 8 ? 'Accredited institution listed' : 'Include degree and institution details',
      },
      achievements: {
        score: achievementsScore,
        max: 5,
        label: 'Achievements',
        feedback: achievementsScore >= 3 ? 'Notable recognitions present' : 'Optional honors or accomplishments',
      },
      certifications: {
        score: certificationsScore,
        max: 5,
        label: 'Certifications',
        feedback: certificationsScore >= 3 ? 'Certifications verified' : 'Optional technical certifications',
      },
      keywords: {
        score: keywordScore,
        max: 5,
        label: 'Role Keyword Relevance',
        feedback: `${matchedKeywords.length}/${targetKeywords.length} target role keywords matched`,
      },
      formatting: {
        score: formattingScore,
        max: 5,
        label: 'ATS Formatting & Cleanliness',
        feedback: 'Clean single-column ATS structure',
      },
    },
    strengths,
    weaknesses,
    missingKeywords,
    matchedKeywords,
    recommendations,
  };
}
