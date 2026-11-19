import { ResumeData } from '@/types/resume';
import { extractResumeText, toCleanStringArray } from './atsEngine';

export type KeywordGroup = 'skills' | 'technical_terms' | 'tools' | 'experience';
export type MatchStatus = 'exact' | 'partial' | 'missing';

export interface KeywordMatchItem {
  keyword: string;
  category: 'languages' | 'frameworks' | 'tools' | 'cloud' | 'practices' | 'concepts';
  group: KeywordGroup;
  frequencyInJD: number;
  foundInResume: boolean;
  matchStatus: MatchStatus;
  matchEvidence?: string;
  isHighPriority: boolean;
  contextRecommendation?: {
    section: 'Summary' | 'Skills' | 'Experience' | 'Projects';
    suggestion: string;
  };
}

export interface GroupBreakdown {
  group: KeywordGroup;
  label: string;
  total: number;
  exact: number;
  partial: number;
  missing: number;
  percentage: number;
}

export interface JobMatchAnalysis {
  isValidJD: boolean;
  validationError?: string;
  matchScore: number;
  matchFormulaNote: string;
  totalJDKeywords: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  experienceOverlapCount: number;
  experienceOverlapTerms: string[];
  resumeExtractedKeywords: string[];
  matchedKeywords: KeywordMatchItem[];
  partialKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
  highPriorityMissing: KeywordMatchItem[];
  groupBreakdowns: GroupBreakdown[];
  importantSkills: string[];
  recommendations: string[];
  targetRoleDetected: string;
}

const KNOWN_KEYWORDS: Array<{
  word: string;
  aliases?: string[];
  category: KeywordMatchItem['category'];
  group: KeywordGroup;
}> = [
  // Languages -> Skills
  { word: 'TypeScript', aliases: ['ts'], category: 'languages', group: 'skills' },
  { word: 'JavaScript', aliases: ['js', 'ecmascript', 'es6'], category: 'languages', group: 'skills' },
  { word: 'Python', category: 'languages', group: 'skills' },
  { word: 'Java', category: 'languages', group: 'skills' },
  { word: 'C++', aliases: ['cpp'], category: 'languages', group: 'skills' },
  { word: 'Go', aliases: ['golang'], category: 'languages', group: 'skills' },
  { word: 'Rust', category: 'languages', group: 'skills' },
  { word: 'SQL', category: 'languages', group: 'skills' },
  { word: 'HTML5', aliases: ['html'], category: 'languages', group: 'skills' },
  { word: 'CSS3', aliases: ['css'], category: 'languages', group: 'skills' },
  { word: 'Bash', aliases: ['shell scripting', 'shell'], category: 'languages', group: 'skills' },
  { word: 'PHP', category: 'languages', group: 'skills' },
  { word: 'Ruby', category: 'languages', group: 'skills' },
  { word: 'Swift', category: 'languages', group: 'skills' },
  { word: 'Kotlin', category: 'languages', group: 'skills' },

  // Frameworks & Libraries -> Skills
  { word: 'React', aliases: ['reactjs', 'react.js'], category: 'frameworks', group: 'skills' },
  { word: 'Next.js', aliases: ['nextjs'], category: 'frameworks', group: 'skills' },
  { word: 'Vue', aliases: ['vue.js', 'vuejs'], category: 'frameworks', group: 'skills' },
  { word: 'Angular', category: 'frameworks', group: 'skills' },
  { word: 'Node.js', aliases: ['nodejs', 'node'], category: 'frameworks', group: 'skills' },
  { word: 'Express', aliases: ['expressjs', 'express.js'], category: 'frameworks', group: 'skills' },
  { word: 'NestJS', category: 'frameworks', group: 'skills' },
  { word: 'Django', category: 'frameworks', group: 'skills' },
  { word: 'FastAPI', category: 'frameworks', group: 'skills' },
  { word: 'Flask', category: 'frameworks', group: 'skills' },
  { word: 'Spring Boot', aliases: ['spring'], category: 'frameworks', group: 'skills' },
  { word: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'], category: 'frameworks', group: 'skills' },
  { word: 'Redux', aliases: ['redux toolkit'], category: 'frameworks', group: 'skills' },
  { word: 'Zustand', category: 'frameworks', group: 'skills' },
  { word: 'GraphQL', category: 'frameworks', group: 'skills' },
  { word: 'REST API', aliases: ['restful', 'rest apis', 'restful api', 'apis'], category: 'frameworks', group: 'technical_terms' },
  { word: 'React Native', category: 'frameworks', group: 'skills' },
  { word: 'Flutter', category: 'frameworks', group: 'skills' },
  { word: 'PyTorch', category: 'frameworks', group: 'skills' },
  { word: 'TensorFlow', category: 'frameworks', group: 'skills' },
  { word: 'Pandas', category: 'frameworks', group: 'skills' },

  // Tools & Cloud -> Tools
  { word: 'Git', category: 'tools', group: 'tools' },
  { word: 'GitHub', aliases: ['github actions'], category: 'tools', group: 'tools' },
  { word: 'Docker', aliases: ['containers', 'containerization'], category: 'tools', group: 'tools' },
  { word: 'Kubernetes', aliases: ['k8s'], category: 'tools', group: 'tools' },
  { word: 'Webpack', category: 'tools', group: 'tools' },
  { word: 'Vite', category: 'tools', group: 'tools' },
  { word: 'Jest', category: 'tools', group: 'tools' },
  { word: 'Cypress', category: 'tools', group: 'tools' },
  { word: 'Playwright', category: 'tools', group: 'tools' },
  { word: 'Linux', category: 'tools', group: 'tools' },
  { word: 'Postman', category: 'tools', group: 'tools' },
  { word: 'Figma', category: 'tools', group: 'tools' },
  { word: 'Jira', category: 'tools', group: 'tools' },
  { word: 'AWS', aliases: ['amazon web services'], category: 'cloud', group: 'tools' },
  { word: 'Azure', aliases: ['microsoft azure'], category: 'cloud', group: 'tools' },
  { word: 'GCP', aliases: ['google cloud'], category: 'cloud', group: 'tools' },
  { word: 'PostgreSQL', aliases: ['postgres', 'psql'], category: 'cloud', group: 'tools' },
  { word: 'MongoDB', aliases: ['mongo'], category: 'cloud', group: 'tools' },
  { word: 'MySQL', category: 'cloud', group: 'tools' },
  { word: 'Redis', category: 'cloud', group: 'tools' },
  { word: 'Kafka', aliases: ['apache kafka'], category: 'cloud', group: 'tools' },
  { word: 'Elasticsearch', category: 'cloud', group: 'tools' },
  { word: 'Firebase', category: 'cloud', group: 'tools' },
  { word: 'Terraform', category: 'cloud', group: 'tools' },

  // Technical Terms & Concepts -> Technical Terms
  { word: 'CI/CD', aliases: ['continuous integration', 'continuous delivery', 'cicd'], category: 'practices', group: 'technical_terms' },
  { word: 'Microservices', aliases: ['microservice', 'micro-services'], category: 'practices', group: 'technical_terms' },
  { word: 'System Design', aliases: ['distributed systems', 'architecture'], category: 'practices', group: 'technical_terms' },
  { word: 'Unit Testing', aliases: ['automated testing', 'unit tests', 'testing'], category: 'practices', group: 'technical_terms' },
  { word: 'TDD', aliases: ['test-driven development'], category: 'practices', group: 'technical_terms' },
  { word: 'Performance Optimization', aliases: ['optimization', 'web vitals', 'latency'], category: 'practices', group: 'technical_terms' },
  { word: 'Accessibility', aliases: ['wcag', 'a11y', 'aria'], category: 'practices', group: 'technical_terms' },
  { word: 'Responsive Design', aliases: ['responsive'], category: 'practices', group: 'technical_terms' },
  { word: 'Security', aliases: ['oauth', 'jwt', 'authentication'], category: 'practices', group: 'technical_terms' },
  { word: 'Clean Code', aliases: ['code review', 'maintainable'], category: 'practices', group: 'technical_terms' },
  { word: 'Data Structures', category: 'concepts', group: 'technical_terms' },
  { word: 'Algorithms', aliases: ['algorithmic'], category: 'concepts', group: 'technical_terms' },
  { word: 'Scalability', aliases: ['scalable', 'high-throughput'], category: 'concepts', group: 'technical_terms' },

  // Experience & Delivery -> Experience
  { word: 'Agile', aliases: ['sprint'], category: 'practices', group: 'experience' },
  { word: 'Scrum', category: 'practices', group: 'experience' },
  { word: 'Cross-functional Collaboration', aliases: ['collaborated', 'stakeholders', 'product and ux'], category: 'practices', group: 'experience' },
  { word: 'Mentorship', aliases: ['mentored', 'leadership', 'code reviews'], category: 'practices', group: 'experience' },
  { word: 'Production Deployment', aliases: ['deployed', 'deployment', 'production'], category: 'practices', group: 'experience' },
  { word: 'API Integration', aliases: ['integrating', 'endpoints', 'integrations'], category: 'practices', group: 'experience' },
];

const GROUP_LABELS: Record<KeywordGroup, string> = {
  skills: 'Skills',
  technical_terms: 'Technical Terms',
  tools: 'Tools & Cloud',
  experience: 'Experience & Delivery',
};

function generateContextRecommendation(
  keyword: string,
  group: KeywordGroup
): KeywordMatchItem['contextRecommendation'] {
  if (group === 'skills') {
    return {
      section: 'Skills',
      suggestion: `Only add "${keyword}" if you have hands-on familiarity—list it in your Technical Skills section.`,
    };
  }
  if (group === 'tools') {
    return {
      section: 'Experience',
      suggestion: `Reference "${keyword}" inside a relevant Experience or Project entry where you used it.`,
    };
  }
  if (group === 'technical_terms') {
    return {
      section: 'Summary',
      suggestion: `Include "${keyword}" in your Professional Summary or Project architecture notes if applicable.`,
    };
  }
  return {
    section: 'Experience',
    suggestion: `Highlight real examples demonstrating "${keyword}" within your Experience bullet points.`,
  };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchKeywordInText(
  word: string,
  aliases: string[] | undefined,
  resumeLower: string,
  skillsLower: string[]
): { status: MatchStatus; evidence?: string } {
  const lower = word.toLowerCase();
  const exactRegex = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(lower)}(?:$|[^a-z0-9+#.])`, 'i');

  if (skillsLower.some((s) => s === lower) || exactRegex.test(` ${resumeLower} `)) {
    return { status: 'exact', evidence: word };
  }

  if (aliases && aliases.length > 0) {
    for (const alias of aliases) {
      const aliasRegex = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(alias.toLowerCase())}(?:$|[^a-z0-9+#.])`, 'i');
      if (aliasRegex.test(` ${resumeLower} `)) {
        return { status: 'partial', evidence: `Matched related term "${alias}"` };
      }
    }
  }

  // Multi-word partial phrase overlap (e.g., "Performance Optimization" -> "optimization" + "performance" or stem)
  const words = lower.split(/[\s/-]+/).filter((w) => w.length >= 4);
  if (words.length >= 2) {
    const matchedParts = words.filter((part) => resumeLower.includes(part));
    if (matchedParts.length >= 1) {
      return { status: 'partial', evidence: `Partial overlap with "${matchedParts[0]}"` };
    }
  }

  return { status: 'missing' };
}

export function extractKeywordsFromResume(resume: ResumeData): string[] {
  const resumeText = extractResumeText(resume);
  const directSkills = [
    ...toCleanStringArray(resume.skills),
    ...toCleanStringArray(resume.technologies),
  ];
  const matchedKnown = KNOWN_KEYWORDS
    .filter((k) => new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(k.word.toLowerCase())}(?:$|[^a-z0-9+#.])`, 'i').test(` ${resumeText} `))
    .map((k) => k.word);
  return Array.from(new Set([...directSkills, ...matchedKnown]));
}

/**
 * Deterministic Job Description Matching Engine
 */
export function analyzeJobMatch(resume: ResumeData, jobDescription: string): JobMatchAnalysis {
  const jd = (jobDescription || '').trim();
  const resumeExtractedKeywords = extractKeywordsFromResume(resume);

  if (!jd) {
    return {
      isValidJD: false,
      matchScore: 0,
      matchFormulaNote: 'Paste a job description to run keyword & experience matching.',
      totalJDKeywords: 0,
      matchedCount: 0,
      partialCount: 0,
      missingCount: 0,
      experienceOverlapCount: 0,
      experienceOverlapTerms: [],
      resumeExtractedKeywords,
      matchedKeywords: [],
      partialKeywords: [],
      missingKeywords: [],
      highPriorityMissing: [],
      groupBreakdowns: [],
      importantSkills: [],
      recommendations: ['Paste a job description to evaluate keyword and experience alignment.'],
      targetRoleDetected: resume.jobTitle || 'General Technical Role',
    };
  }

  const alphaWords = jd.match(/[a-zA-Z]{2,}/g) || [];
  if (jd.length < 20 || alphaWords.length < 4) {
    return {
      isValidJD: false,
      validationError: 'The entered text is too short or does not appear to be a valid job description. Please paste a full posting or at least a few sentences.',
      matchScore: 0,
      matchFormulaNote: 'Insufficient job description content to compute a reliable match.',
      totalJDKeywords: 0,
      matchedCount: 0,
      partialCount: 0,
      missingCount: 0,
      experienceOverlapCount: 0,
      experienceOverlapTerms: [],
      resumeExtractedKeywords,
      matchedKeywords: [],
      partialKeywords: [],
      missingKeywords: [],
      highPriorityMissing: [],
      groupBreakdowns: [],
      importantSkills: [],
      recommendations: ['Provide at least a short list of job responsibilities or required skills.'],
      targetRoleDetected: resume.jobTitle || 'General Technical Role',
    };
  }

  const jdLower = jd.toLowerCase();
  const resumeText = extractResumeText(resume);
  const skillsLower = [
    ...toCleanStringArray(resume.skills),
    ...toCleanStringArray(resume.technologies),
  ].map((s) => s.toLowerCase().trim());

  const extractedKeywords: Array<{
    keyword: string;
    category: KeywordMatchItem['category'];
    group: KeywordGroup;
    freq: number;
    matchStatus: MatchStatus;
    matchEvidence?: string;
  }> = [];

  for (const item of KNOWN_KEYWORDS) {
    const termsToSearch = [item.word, ...(item.aliases || [])];
    let count = 0;
    for (const term of termsToSearch) {
      const regex = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(term.toLowerCase())}(?:$|[^a-z0-9+#.])`, 'gi');
      const matches = (` ${jdLower} `).match(regex);
      if (matches) count += matches.length;
    }

    if (count > 0) {
      const matchCheck = matchKeywordInText(item.word, item.aliases, resumeText, skillsLower);
      extractedKeywords.push({
        keyword: item.word,
        category: item.category,
        group: item.group,
        freq: count,
        matchStatus: matchCheck.status,
        matchEvidence: matchCheck.evidence,
      });
    }
  }

  // Extract additional repeated domain terms if capitalized or frequent in JD
  const additionalWords = jd.match(/\b[A-Z][a-zA-Z0-9+#.-]{2,}\b/g) || [];
  const commonStopWords = new Set([
    'The', 'We', 'You', 'Our', 'They', 'This', 'That', 'With', 'From', 'Have',
    'Are', 'Will', 'Must', 'Plus', 'Your', 'About', 'Team', 'Company', 'Role',
    'Experience', 'Years', 'Job', 'Work', 'Required', 'Preferred', 'Apply', 'Full',
    'Time', 'Benefits', 'Salary', 'Opportunity', 'Strong', 'Ability', 'Candidate',
    'Requirements', 'Responsibilities', 'Qualifications', 'Looking', 'Seeking', 'Build',
    'Design', 'Develop', 'Maintain', 'Engineering', 'Software', 'Developer', 'Engineer'
  ]);

  const existingWords = new Set(extractedKeywords.map((k) => k.keyword.toLowerCase()));
  for (const word of additionalWords) {
    const lower = word.toLowerCase();
    if (
      !existingWords.has(lower) &&
      !commonStopWords.has(word) &&
      word.length >= 3 &&
      !/^\d+$/.test(word)
    ) {
      existingWords.add(lower);
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      const matches = jd.match(regex);
      const count = matches ? matches.length : 1;
      if (count >= 2) {
        const matchCheck = matchKeywordInText(word, undefined, resumeText, skillsLower);
        extractedKeywords.push({
          keyword: word,
          category: 'tools',
          group: 'technical_terms',
          freq: count,
          matchStatus: matchCheck.status,
          matchEvidence: matchCheck.evidence,
        });
      }
    }
  }

  extractedKeywords.sort((a, b) => b.freq - a.freq);

  const matchedKeywords: KeywordMatchItem[] = [];
  const partialKeywords: KeywordMatchItem[] = [];
  const missingKeywords: KeywordMatchItem[] = [];
  const highPriorityMissing: KeywordMatchItem[] = [];

  for (const item of extractedKeywords) {
    const isHighPriority = item.freq >= 2 || item.group === 'skills';
    const matchItem: KeywordMatchItem = {
      keyword: item.keyword,
      category: item.category,
      group: item.group,
      frequencyInJD: item.freq,
      foundInResume: item.matchStatus !== 'missing',
      matchStatus: item.matchStatus,
      matchEvidence: item.matchEvidence,
      isHighPriority,
      contextRecommendation: generateContextRecommendation(item.keyword, item.group),
    };

    if (item.matchStatus === 'exact') {
      matchedKeywords.push(matchItem);
    } else if (item.matchStatus === 'partial') {
      partialKeywords.push(matchItem);
    } else {
      missingKeywords.push(matchItem);
      if (isHighPriority) {
        highPriorityMissing.push(matchItem);
      }
    }
  }

  // Experience & project overlap check
  const expText = [
    ...(resume.experiences || []).map((e) => `${e.jobTitle || ''} ${e.description || ''}`),
    ...(resume.projects || []).map((p) => `${p.title || ''} ${p.description || ''} ${p.technologies || ''}`),
  ]
    .join(' ')
    .toLowerCase();

  const experienceOverlapTerms = [...matchedKeywords, ...partialKeywords]
    .filter((k) => expText.includes(k.keyword.toLowerCase()))
    .map((k) => k.keyword);

  // Transparent deterministic formula:
  // Exact match = 1.0 weight, Partial match = 0.5 weight
  const totalKeywords = extractedKeywords.length;
  let matchScore = 0;
  if (totalKeywords > 0) {
    const weightedMatched = matchedKeywords.length + partialKeywords.length * 0.5;
    matchScore = Math.max(0, Math.min(100, Math.round((weightedMatched / totalKeywords) * 100)));
  }

  // Group breakdown metrics
  const groups: KeywordGroup[] = ['skills', 'technical_terms', 'tools', 'experience'];
  const groupBreakdowns: GroupBreakdown[] = groups.map((g) => {
    const inGroup = [...matchedKeywords, ...partialKeywords, ...missingKeywords].filter((k) => k.group === g);
    const exact = inGroup.filter((k) => k.matchStatus === 'exact').length;
    const partial = inGroup.filter((k) => k.matchStatus === 'partial').length;
    const missing = inGroup.filter((k) => k.matchStatus === 'missing').length;
    const total = inGroup.length;
    const percentage = total > 0 ? Math.round(((exact + partial * 0.5) / total) * 100) : 100;
    return {
      group: g,
      label: GROUP_LABELS[g],
      total,
      exact,
      partial,
      missing,
      percentage,
    };
  });

  // Detect likely target role from JD
  let targetRoleDetected = 'Software Engineer';
  if (/full[\s-]?stack|mern|mean/i.test(jdLower)) {
    targetRoleDetected = 'Full Stack Developer';
  } else if (/frontend|front[\s-]?end|react|vue|angular|ui\/ux/i.test(jdLower)) {
    targetRoleDetected = 'Frontend Developer';
  } else if (/backend|back[\s-]?end|api|microservices|spring|django/i.test(jdLower)) {
    targetRoleDetected = 'Backend Developer';
  } else if (/devops|sre|kubernetes|docker|terraform|cloud engineer/i.test(jdLower)) {
    targetRoleDetected = 'DevOps / SRE Engineer';
  } else if (/data engineer|data analyst|pandas|machine learning/i.test(jdLower)) {
    targetRoleDetected = 'Data & AI Engineer';
  }

  const recommendations: string[] = [];
  if (totalKeywords === 0) {
    recommendations.push('Few recognized technical terms were detected in this posting. Try pasting the full Qualifications/Requirements section.');
  } else {
    if (highPriorityMissing.length > 0) {
      const topMissing = highPriorityMissing.slice(0, 4).map((k) => k.keyword).join(', ');
      recommendations.push(`Missing high-frequency terms (${topMissing}): add them only where they reflect your real background.`);
    }
    if (partialKeywords.length > 0) {
      const partialSample = partialKeywords.slice(0, 3).map((k) => k.keyword).join(', ');
      recommendations.push(`Partially matched (${partialSample}): consider using exact phrasing from the job description for clearer keyword matching.`);
    }
    if (experienceOverlapTerms.length < Math.min(3, matchedKeywords.length)) {
      recommendations.push('Several matched skills appear only in your Skills list—demonstrate them in your Experience or Project descriptions.');
    }
    if (matchScore >= 75) {
      recommendations.push(`Strong keyword coverage (${matchScore}%). Ensure your summary leads with ${targetRoleDetected} alignment.`);
    }
  }

  const importantSkills = extractedKeywords.slice(0, 12).map((k) => k.keyword);

  return {
    isValidJD: true,
    matchScore,
    matchFormulaNote: `Calculated transparently from ${totalKeywords} extracted JD terms: (${matchedKeywords.length} exact + ${partialKeywords.length} × 0.5 partial) / ${totalKeywords}.`,
    totalJDKeywords: totalKeywords,
    matchedCount: matchedKeywords.length,
    partialCount: partialKeywords.length,
    missingCount: missingKeywords.length,
    experienceOverlapCount: experienceOverlapTerms.length,
    experienceOverlapTerms,
    resumeExtractedKeywords,
    matchedKeywords,
    partialKeywords,
    missingKeywords,
    highPriorityMissing,
    groupBreakdowns,
    importantSkills,
    recommendations,
    targetRoleDetected,
  };
}

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'NextGen Tech',
    text: `We are looking for a Senior Frontend Engineer to build high-performance, accessible web applications.
Requirements:
- 4+ years of hands-on experience with React, TypeScript, and modern JavaScript (ES6+).
- Strong proficiency in Next.js, Tailwind CSS, and state management (Redux, Zustand).
- Experience integrating REST API and GraphQL services.
- Familiarity with automated testing using Jest, Playwright, or Cypress.
- Solid understanding of Git, CI/CD pipelines, Docker, and performance optimization.
- Passion for responsive design, Web Vitals, accessibility, and UI/UX craftsmanship.`
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'CloudScale Systems',
    text: `Seeking a versatile Full Stack Developer to architect scalable cloud applications.
Key Responsibilities & Tech Stack:
- Design and develop robust microservices using Node.js, Express, and TypeScript.
- Build clean, interactive client interfaces in React and Next.js with Tailwind CSS.
- Manage databases using PostgreSQL, MongoDB, and Redis caching.
- Deploy containerized services with Docker and Kubernetes on AWS or GCP.
- Implement CI/CD pipelines using GitHub Actions.
- Ensure high test coverage with Unit Testing and System Design best practices.`
  },
  {
    title: 'Backend Systems Engineer',
    company: 'DataStream Core',
    text: `Looking for a Backend Systems Engineer to handle high-throughput distributed architectures.
Qualifications:
- Deep experience with Python, Go, or Java and frameworks like FastAPI or Spring Boot.
- Expertise in SQL, PostgreSQL, database indexing, and query optimization.
- Hands-on experience with Kafka, Redis, Docker, and Linux systems.
- Strong knowledge of REST API design, authentication, security, and AWS services.
- Familiarity with Agile development and Git workflows.`
  }
];
