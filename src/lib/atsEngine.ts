import { ResumeData } from '@/types/resume';

export interface ATSSectionScore {
  score: number;
  max: number;
  label: string;
  feedback: string;
}

export interface ATSBreakdown {
  jobTitleRelevance: ATSSectionScore;
  keywordMatch: ATSSectionScore;
  contentCompleteness: ATSSectionScore;
  experienceProjects: ATSSectionScore;
  educationCertifications: ATSSectionScore;
  atsFormatting: ATSSectionScore;
  // Aliases for compatibility with other internal tools (health analyzer, comparator)
  contact?: ATSSectionScore;
  summary?: ATSSectionScore;
  skills?: ATSSectionScore;
  experience?: ATSSectionScore;
  projects?: ATSSectionScore;
  education?: ATSSectionScore;
  achievements?: ATSSectionScore;
  certifications?: ATSSectionScore;
  keywords?: ATSSectionScore;
  formatting?: ATSSectionScore;
}

export interface ATSAnalysisResult {
  score: number;
  status: 'Weak Match' | 'Needs Improvement' | 'Good Match' | 'Strong Match' | 'Excellent Match';
  statusColor: string;
  targetJobTitle: string;
  targetRole: string; // compatibility
  breakdown: ATSBreakdown;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  matchedKeywords: string[];
  recommendations: string[];
  analyzedAt?: string;
}

export const ROLE_KEYWORD_DICTIONARIES: Record<string, string[]> = {
  'Frontend Developer': [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind',
    'Next.js', 'Redux', 'REST API', 'Git', 'Webpack', 'Vite',
    'Responsive Design', 'Testing', 'Jest', 'Accessibility', 'UI/UX'
  ],
  'Backend Developer': [
    'Node.js', 'Express', 'REST API', 'MongoDB', 'PostgreSQL', 'SQL',
    'Authentication', 'JWT', 'Docker', 'Microservices', 'Python', 'Java',
    'Redis', 'API Design', 'Database', 'Git', 'Linux', 'AWS'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript',
    'REST API', 'Git', 'SQL', 'Docker', 'PostgreSQL', 'Tailwind', 'Next.js',
    'State Management', 'Database', 'CI/CD'
  ],
  'Software Engineer': [
    'Data Structures', 'Algorithms', 'TypeScript', 'Python', 'Java', 'C++',
    'OOP', 'Git', 'SQL', 'APIs', 'Unit Testing', 'Debugging', 'REST API',
    'System Design', 'Linux', 'Problem Solving'
  ],
  'React Developer': [
    'React', 'JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Context API',
    'Tailwind CSS', 'Component Lifecycle', 'State Management', 'Jest',
    'React Router', 'HTML', 'CSS', 'REST API', 'Git'
  ],
  'Node.js Developer': [
    'Node.js', 'Express', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL',
    'REST API', 'Microservices', 'JWT', 'Redis', 'Docker', 'Event Loop',
    'Unit Testing', 'Git', 'SQL'
  ],
  'Python Developer': [
    'Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'SQL',
    'REST API', 'Pandas', 'NumPy', 'Docker', 'Git', 'Linux',
    'Unit Testing', 'ORM', 'APIs'
  ],
  'Java Developer': [
    'Java', 'Spring Boot', 'Spring MVC', 'Hibernate', 'JPA', 'Maven',
    'SQL', 'PostgreSQL', 'MySQL', 'Microservices', 'REST API', 'JUnit',
    'Git', 'Docker'
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
  ],
  'UI/UX Designer': [
    'Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems',
    'Information Architecture', 'Usability Testing', 'Responsive Design',
    'Accessibility', 'Mobile Design', 'HTML', 'CSS'
  ],
  'Product Manager': [
    'Product Strategy', 'Roadmap', 'User Stories', 'Agile', 'Scrum',
    'Market Research', 'Analytics', 'Stakeholder Management', 'A/B Testing',
    'KPI', 'Feature Prioritization', 'Jira'
  ],
  'QA Engineer': [
    'Automation Testing', 'Selenium', 'Cypress', 'Jest', 'Test Cases',
    'Regression Testing', 'Manual Testing', 'Bug Tracking', 'API Testing',
    'Postman', 'CI/CD', 'QA Methodology', 'Git'
  ],
  'Cloud Engineer': [
    'AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda', 'IAM', 'VPC',
    'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Monitoring', 'Networking', 'Security'
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
 * Extracts all textual content from a ResumeData object for keyword searching.
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
      parts.push(exp.jobTitle || '');
      parts.push(exp.company || '');
      parts.push(exp.description || '');
      if (exp.technologies) parts.push(...exp.technologies);
    });
  }

  if (resume.projects) {
    resume.projects.forEach((proj) => {
      parts.push(proj.title || '');
      parts.push(proj.description || '');
      if (proj.technologies) parts.push(...proj.technologies);
    });
  }

  if (resume.education) {
    resume.education.forEach((edu) => {
      parts.push(edu.institution || '');
      parts.push(edu.degree || '');
      parts.push(edu.fieldOfStudy || '');
      parts.push(edu.coursework || '');
    });
  }

  if (resume.certifications) {
    resume.certifications.forEach((cert) => {
      parts.push(cert.name || '');
      parts.push(cert.issuer || '');
    });
  }

  if (resume.achievements) {
    resume.achievements.forEach((ach) => {
      parts.push(ach.title || '');
      parts.push(ach.description || '');
    });
  }

  return parts.join(' ').toLowerCase();
}

/**
 * Checks whether a keyword exists in the resume.
 * Ensures we don't falsely claim a keyword is missing if it already exists.
 */
function keywordExistsInResume(keyword: string, resumeFullText: string, skillsList: string[]): boolean {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return false;

  // Direct check in skills array
  if (skillsList.some((s) => s.toLowerCase().trim() === kw || s.toLowerCase().includes(kw))) {
    return true;
  }

  // Exact phrase check in full text
  if (resumeFullText.includes(kw)) {
    return true;
  }

  // Special aliases handling
  const aliases: Record<string, string[]> = {
    'react': ['react.js', 'reactjs'],
    'node.js': ['nodejs', 'node'],
    'tailwind': ['tailwind css', 'tailwindcss'],
    'next.js': ['nextjs', 'next'],
    'postgresql': ['postgres', 'psql'],
    'javascript': ['js', 'es6'],
    'typescript': ['ts'],
    'rest api': ['restful api', 'rest apis', 'restful'],
    'ui/ux': ['ui', 'ux', 'user experience', 'user interface'],
    'docker': ['containerization', 'containers'],
    'aws': ['amazon web services'],
    'ci/cd': ['continuous integration', 'github actions', 'jenkins', 'gitlab ci']
  };

  const currentAliases = aliases[kw];
  if (currentAliases && currentAliases.some((alias) => resumeFullText.includes(alias))) {
    return true;
  }

  return false;
}

/**
 * Derives target keywords for any user-entered job title.
 */
function getKeywordsForRole(targetJobTitle: string): string[] {
  const trimmed = targetJobTitle.trim();
  if (!trimmed) {
    return ROLE_KEYWORD_DICTIONARIES['Software Engineer'];
  }

  // 1. Direct exact dictionary match
  for (const [roleKey, words] of Object.entries(ROLE_KEYWORD_DICTIONARIES)) {
    if (roleKey.toLowerCase() === trimmed.toLowerCase()) {
      return words;
    }
  }

  // 2. Partial match in dictionary keys
  const lower = trimmed.toLowerCase();
  for (const [roleKey, words] of Object.entries(ROLE_KEYWORD_DICTIONARIES)) {
    if (lower.includes(roleKey.toLowerCase()) || roleKey.toLowerCase().includes(lower)) {
      return words;
    }
  }

  // 3. Fallback for custom role: extract meaningful domain words and combine with closest role
  const stopWords = new Set(['senior', 'junior', 'lead', 'principal', 'staff', 'associate', 'intern', 'specialist', 'developer', 'engineer', 'manager', 'and', 'the', 'for', 'of', 'in', 'at']);
  const titleTokens = lower.split(/[\s/,-]+/).filter((t) => t.length > 1 && !stopWords.has(t));

  let matchedDict: string[] | null = null;
  if (titleTokens.some((t) => ['front', 'frontend', 'web', 'ui', 'react', 'vue', 'angular'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['Frontend Developer'];
  } else if (titleTokens.some((t) => ['back', 'backend', 'api', 'server', 'node', 'django', 'spring'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['Backend Developer'];
  } else if (titleTokens.some((t) => ['full', 'fullstack'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['Full Stack Developer'];
  } else if (titleTokens.some((t) => ['data', 'analytics', 'bi', 'business'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['Data Analyst'];
  } else if (titleTokens.some((t) => ['devops', 'cloud', 'sre', 'infrastructure'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['DevOps Engineer'];
  } else if (titleTokens.some((t) => ['mobile', 'ios', 'android', 'flutter'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['Mobile Developer'];
  } else if (titleTokens.some((t) => ['qa', 'test', 'testing', 'quality'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['QA Engineer'];
  } else if (titleTokens.some((t) => ['design', 'ux', 'product'].includes(t))) {
    matchedDict = ROLE_KEYWORD_DICTIONARIES['UI/UX Designer'];
  }

  const baseKeywords = matchedDict || ROLE_KEYWORD_DICTIONARIES['Software Engineer'];
  // Capitalize custom title tokens and prepend to target keywords
  const customKeywords = titleTokens.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
  const uniqueCombined = Array.from(new Set([...customKeywords, ...baseKeywords]));
  return uniqueCombined.slice(0, 16);
}

/**
 * Deterministic ATS Scoring Engine
 * Analyzes resume content across the 6 requested dimensions (Total 100 points):
 * 1. Job Title / Role Relevance — 20 points
 * 2. Skills & Keyword Match — 30 points
 * 3. Resume Content Completeness — 15 points
 * 4. Experience / Project Relevance — 15 points
 * 5. Education & Certifications — 10 points
 * 6. ATS Formatting / Structure — 10 points
 *
 * TOTAL = 100 POINTS
 */
export function calculateATSScore(
  resume: ResumeData,
  targetJobTitle = 'Full Stack Developer',
  _customJobDescription = ''
): ATSAnalysisResult {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  const rawRole = (targetJobTitle || '').trim() || 'Software Engineer';
  const roleLower = rawRole.toLowerCase();

  const fullName = (resume?.fullName || '').trim();
  const email = (resume?.email || '').trim();
  const phone = (resume?.phone || '').trim();
  const headline = (resume?.jobTitle || '').trim();
  const summary = (resume?.summary || resume?.aboutMe || '').trim();
  const experiences = resume?.experiences || [];
  const projects = resume?.projects || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];
  const certifications = resume?.certifications || [];
  const achievements = resume?.achievements || [];

  const resumeFullText = extractResumeText(resume);
  const skillsList = [...skills, ...(resume?.technologies || [])];

  // Tokenize target role for semantic relevance
  const stopWords = new Set(['senior', 'junior', 'lead', 'principal', 'staff', 'associate', 'intern', 'the', 'and', 'for', 'of', 'in', 'at']);
  const roleTokens = roleLower.split(/[\s/,-]+/).filter((t) => t.length > 1 && !stopWords.has(t));

  // ==========================================
  // 1. Job Title / Role Relevance (20 Points)
  // ==========================================
  let jobTitleScore = 0;

  // 1a. Headline / Resume Job Title (up to 7 pts)
  if (headline) {
    const headLower = headline.toLowerCase();
    if (headLower === roleLower || headLower.includes(roleLower) || roleLower.includes(headLower)) {
      jobTitleScore += 7;
    } else {
      const matchCount = roleTokens.filter((t) => headLower.includes(t)).length;
      if (matchCount > 0) {
        jobTitleScore += Math.min(6, 3 + matchCount * 1.5);
      } else {
        jobTitleScore += 2; // present but different role
      }
    }
  }

  // 1b. Professional Summary Relevance (up to 4 pts)
  if (summary) {
    const sumLower = summary.toLowerCase();
    if (sumLower.includes(roleLower)) {
      jobTitleScore += 4;
    } else {
      const matchCount = roleTokens.filter((t) => sumLower.includes(t)).length;
      if (matchCount > 0) {
        jobTitleScore += Math.min(3.5, 1.5 + matchCount * 1);
      } else if (summary.length > 30) {
        jobTitleScore += 1;
      }
    }
  }

  // 1c. Experience Job Titles & Descriptions (up to 4 pts)
  if (experiences.length > 0) {
    let expRoleMatch = 0;
    experiences.forEach((exp) => {
      const titleLower = (exp.jobTitle || '').toLowerCase();
      if (titleLower.includes(roleLower) || roleLower.includes(titleLower)) {
        expRoleMatch += 2.5;
      } else if (roleTokens.some((t) => titleLower.includes(t))) {
        expRoleMatch += 1.5;
      }
    });
    jobTitleScore += Math.min(4, Math.max(1, Math.round(expRoleMatch)));
  }

  // 1d. Projects Relevance to Role (up to 3 pts)
  if (projects.length > 0) {
    let projMatch = 0;
    projects.forEach((p) => {
      const pText = `${p.title} ${p.description} ${(p.technologies || []).join(' ')}`.toLowerCase();
      if (roleTokens.some((t) => pText.includes(t))) {
        projMatch += 1.5;
      }
    });
    jobTitleScore += Math.min(3, Math.max(0.5, Math.round(projMatch)));
  }

  // 1e. Skills matching role (up to 2 pts)
  const skillsMatchingRole = roleTokens.filter((t) =>
    skillsList.some((s) => s.toLowerCase().includes(t))
  ).length;
  if (skillsMatchingRole > 0) {
    jobTitleScore += 2;
  } else if (skillsList.length > 0) {
    jobTitleScore += 1;
  }

  jobTitleScore = Math.min(20, Math.max(0, Math.round(jobTitleScore)));

  if (jobTitleScore >= 16) {
    strengths.push(`Direct title alignment for "${rawRole}" across headline, summary, and experience.`);
  } else if (jobTitleScore >= 10) {
    recommendations.push(`Align your headline and summary explicitly with "${rawRole}" to increase role relevance.`);
  } else {
    weaknesses.push(`Low role relevance for "${rawRole}". Resume headline and experience do not clearly reflect this target title.`);
    recommendations.push(`Set your resume headline to "${rawRole}" and reference this role in your summary.`);
  }

  // ==========================================
  // 2. Skills & Keyword Match (30 Points)
  // ==========================================
  const targetKeywords = getKeywordsForRole(rawRole);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  targetKeywords.forEach((kw) => {
    if (keywordExistsInResume(kw, resumeFullText, skillsList)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const matchRatio = targetKeywords.length > 0 ? matchedKeywords.length / targetKeywords.length : 0;
  let keywordScore = Math.round(matchRatio * 30);
  if (matchedKeywords.length >= 8) keywordScore = Math.max(keywordScore, 24);
  if (matchedKeywords.length >= 12) keywordScore = Math.max(keywordScore, 28);
  if (matchedKeywords.length === targetKeywords.length && targetKeywords.length > 0) keywordScore = 30;
  keywordScore = Math.min(30, Math.max(2, keywordScore));

  if (matchedKeywords.length >= 6) {
    strengths.push(`Matched ${matchedKeywords.length} core target keywords including ${matchedKeywords.slice(0, 3).join(', ')}.`);
  } else {
    weaknesses.push(`Missing key role terms for ${rawRole} (${missingKeywords.slice(0, 4).join(', ')}).`);
    recommendations.push(`Add essential role keywords: ${missingKeywords.slice(0, 4).join(', ')} into your Skills or Experience bullets.`);
  }

  // ==========================================
  // 3. Resume Content Completeness (15 Points)
  // ==========================================
  let completenessScore = 0;

  // Contact (3 pts)
  if (fullName.length >= 2 && email.includes('@')) completenessScore += 1.5;
  if (phone.length >= 6 || (resume?.location || '').length > 2 || (resume?.linkedin || '').length > 5) completenessScore += 1.5;

  // Summary (2 pts)
  const summaryWords = summary ? summary.split(/\s+/).filter(Boolean).length : 0;
  if (summaryWords >= 20) completenessScore += 2;
  else if (summaryWords >= 5) completenessScore += 1;

  // Skills (2 pts)
  if (skillsList.length >= 6) completenessScore += 2;
  else if (skillsList.length >= 2) completenessScore += 1;

  // Experience (3 pts)
  if (experiences.length >= 2) completenessScore += 3;
  else if (experiences.length === 1) completenessScore += 2;

  // Projects (2 pts)
  if (projects.length >= 2) completenessScore += 2;
  else if (projects.length === 1) completenessScore += 1.5;

  // Education (2 pts)
  if (education.length >= 1) {
    const hasDetails = education.some((e) => (e.degree || '').length > 2 && (e.institution || '').length > 2);
    completenessScore += hasDetails ? 2 : 1;
  }

  // Certifications / Achievements (1 pt)
  if (certifications.length > 0 || achievements.length > 0) {
    completenessScore += 1;
  }

  completenessScore = Math.min(15, Math.max(0, Math.round(completenessScore)));

  if (completenessScore >= 13) {
    strengths.push('Comprehensive resume structure containing all essential career sections.');
  } else {
    if (summaryWords === 0) weaknesses.push('Missing professional summary.');
    if (experiences.length === 0) weaknesses.push('No work experience entries listed.');
    if (projects.length === 0) weaknesses.push('No projects documented.');
    recommendations.push('Complete any empty resume sections (Summary, Projects, or Certifications) to maximize completeness.');
  }

  // ==========================================
  // 4. Experience / Project Relevance (15 Points)
  // ==========================================
  let relevanceScore = 0;
  let actionVerbCount = 0;
  let metricCount = 0;
  let roleTermsInExp = 0;

  const combinedExpAndProjText = [
    ...experiences.map((e) => `${e.jobTitle} ${e.company} ${e.description}`),
    ...projects.map((p) => `${p.title} ${p.description} ${(p.technologies || []).join(' ')}`)
  ].join(' ').toLowerCase();

  ACTION_VERBS.forEach((verb) => {
    if (combinedExpAndProjText.includes(verb)) actionVerbCount++;
  });

  if (METRIC_PATTERN.test(combinedExpAndProjText)) {
    const matches = combinedExpAndProjText.match(new RegExp(METRIC_PATTERN, 'g')) || [];
    metricCount = matches.length;
  }

  roleTokens.forEach((t) => {
    if (combinedExpAndProjText.includes(t)) roleTermsInExp++;
  });

  // Role technical terms in experience/projects (up to 6 pts)
  if (roleTermsInExp >= 4) relevanceScore += 6;
  else if (roleTermsInExp >= 2) relevanceScore += 4;
  else if (roleTermsInExp >= 1) relevanceScore += 2;

  // Action verbs (up to 4 pts)
  if (actionVerbCount >= 4) relevanceScore += 4;
  else if (actionVerbCount >= 2) relevanceScore += 2.5;
  else if (actionVerbCount >= 1) relevanceScore += 1;

  // Quantifiable metrics (up to 5 pts)
  if (metricCount >= 2) relevanceScore += 5;
  else if (metricCount === 1) relevanceScore += 3;

  relevanceScore = Math.min(15, Math.max(1, Math.round(relevanceScore)));

  if (metricCount > 0 && actionVerbCount >= 2) {
    strengths.push('Impact-oriented experience bullets with strong action verbs and quantifiable metrics.');
  } else if (metricCount === 0) {
    weaknesses.push('Experience descriptions lack quantifiable impact (e.g. %, $, numbers, or scale).');
    recommendations.push('Quantify your achievements with measurable results (e.g., "improved load time by 35%").');
  }

  // ==========================================
  // 5. Education & Certifications (10 Points)
  // ==========================================
  let eduCertScore = 0;

  if (education.length > 0) {
    eduCertScore += 4; // degree & institution
    if (education.some((e) => e.graduationDate || e.fieldOfStudy || e.gpa)) {
      eduCertScore += 2;
    }
  }

  if (certifications.length >= 2) {
    eduCertScore += 4;
  } else if (certifications.length === 1) {
    eduCertScore += 3;
  } else if (education.some((e) => e.coursework)) {
    eduCertScore += 2;
  }

  eduCertScore = Math.min(10, Math.max(1, Math.round(eduCertScore)));

  if (eduCertScore >= 8) {
    strengths.push('Accredited education and verified credentials supporting domain expertise.');
  } else if (certifications.length === 0) {
    recommendations.push('Add industry certifications (e.g. AWS, Meta, Scrum) to strengthen qualifications.');
  }

  // ==========================================
  // 6. ATS Formatting / Structure (10 Points)
  // ==========================================
  let formatScore = 10;

  // Deduct for missing essential contact info
  if (!fullName || !email) formatScore -= 3;
  if (!phone) formatScore -= 1;

  // Check for excessively long unbroken text
  const hasOverlyLongText = experiences.some((e) => (e.description || '').length > 800) || summary.length > 1000;
  if (hasOverlyLongText) formatScore -= 2;

  // Check for broken entries (empty jobTitle or company)
  if (experiences.some((e) => !e.jobTitle || !e.company)) formatScore -= 2;

  formatScore = Math.min(10, Math.max(2, formatScore));

  if (formatScore >= 8) {
    strengths.push('Clean, single-column ATS-friendly formatting with standard section headers.');
  } else {
    weaknesses.push('Formatting issues: missing contact details or inconsistent section entries.');
    recommendations.push('Ensure each experience entry has both a title and company, and keep bullet points concise.');
  }

  // ==========================================
  // TOTAL SCORE COMPUTATION
  // ==========================================
  const totalScore = Math.min(
    100,
    Math.max(0, jobTitleScore + keywordScore + completenessScore + relevanceScore + eduCertScore + formatScore)
  );

  // Exact Match Categories as specified by user:
  // 90–100: Excellent Match
  // 80–89: Strong Match
  // 70–79: Good Match
  // 60–69: Needs Improvement
  // Below 60: Weak Match
  let status: ATSAnalysisResult['status'] = 'Weak Match';
  let statusColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300';

  if (totalScore >= 90) {
    status = 'Excellent Match';
    statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300';
  } else if (totalScore >= 80) {
    status = 'Strong Match';
    statusColor = 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300';
  } else if (totalScore >= 70) {
    status = 'Good Match';
    statusColor = 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300';
  } else if (totalScore >= 60) {
    status = 'Needs Improvement';
    statusColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300';
  }

  const breakdown: ATSBreakdown = {
    jobTitleRelevance: {
      score: jobTitleScore,
      max: 20,
      label: 'Job Title Relevance',
      feedback: jobTitleScore >= 16 ? 'Strong alignment with target role' : 'Incorporate role title into headline and summary',
    },
    keywordMatch: {
      score: keywordScore,
      max: 30,
      label: 'Keyword Match',
      feedback: `${matchedKeywords.length}/${targetKeywords.length} target role keywords matched`,
    },
    contentCompleteness: {
      score: completenessScore,
      max: 15,
      label: 'Content Completeness',
      feedback: completenessScore >= 12 ? 'Complete core resume sections' : 'Fill missing sections (Summary, Projects, or Certs)',
    },
    experienceProjects: {
      score: relevanceScore,
      max: 15,
      label: 'Experience / Projects',
      feedback: relevanceScore >= 11 ? 'Impact-driven bullets with metrics' : 'Add measurable impact and action verbs',
    },
    educationCertifications: {
      score: eduCertScore,
      max: 10,
      label: 'Education / Certifications',
      feedback: eduCertScore >= 8 ? 'Accredited degree & credentials' : 'Add degree details and industry certifications',
    },
    atsFormatting: {
      score: formatScore,
      max: 10,
      label: 'ATS Formatting',
      feedback: formatScore >= 8 ? 'Clean, parseable resume structure' : 'Ensure all entries have titles and standard headers',
    },
    // Compatibility aliases for other internal tools
    contact: {
      score: Math.round((completenessScore / 15) * 10),
      max: 10,
      label: 'Contact Information',
      feedback: 'Contact headers evaluated',
    },
    summary: {
      score: Math.round((jobTitleScore / 20) * 10),
      max: 10,
      label: 'Professional Summary',
      feedback: 'Summary alignment evaluated',
    },
    skills: {
      score: Math.round((keywordScore / 30) * 15),
      max: 15,
      label: 'Technical Skills',
      feedback: 'Skills coverage evaluated',
    },
    experience: {
      score: relevanceScore,
      max: 20,
      label: 'Work Experience',
      feedback: 'Experience relevance evaluated',
    },
    projects: {
      score: Math.round((relevanceScore / 15) * 15),
      max: 15,
      label: 'Projects',
      feedback: 'Projects evaluated',
    },
    education: {
      score: eduCertScore,
      max: 10,
      label: 'Education',
      feedback: 'Education evaluated',
    },
    formatting: {
      score: formatScore,
      max: 5,
      label: 'ATS Formatting',
      feedback: 'Formatting evaluated',
    },
  };

  return {
    score: totalScore,
    status,
    statusColor,
    targetJobTitle: rawRole,
    targetRole: rawRole,
    breakdown,
    strengths,
    weaknesses,
    missingKeywords,
    matchedKeywords,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}
