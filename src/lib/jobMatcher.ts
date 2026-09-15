import { ResumeData } from '@/types/resume';
import { extractResumeText } from './atsEngine';

export interface KeywordMatchItem {
  keyword: string;
  category: 'languages' | 'frameworks' | 'tools' | 'cloud' | 'practices' | 'concepts';
  frequencyInJD: number;
  foundInResume: boolean;
  isHighPriority: boolean;
  contextRecommendation?: {
    section: 'Summary' | 'Skills' | 'Experience' | 'Projects';
    suggestion: string;
  };
}

export interface JobMatchAnalysis {
  matchScore: number;
  totalJDKeywords: number;
  matchedCount: number;
  missingCount: number;
  matchedKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
  highPriorityMissing: KeywordMatchItem[];
  importantSkills: string[];
  recommendations: string[];
  targetRoleDetected: string;
}

// Comprehensive technical keyword dictionary with category tags
const KNOWN_KEYWORDS: Array<{ word: string; category: KeywordMatchItem['category'] }> = [
  // Languages
  { word: 'TypeScript', category: 'languages' },
  { word: 'JavaScript', category: 'languages' },
  { word: 'Python', category: 'languages' },
  { word: 'Java', category: 'languages' },
  { word: 'C++', category: 'languages' },
  { word: 'Go', category: 'languages' },
  { word: 'Rust', category: 'languages' },
  { word: 'SQL', category: 'languages' },
  { word: 'HTML5', category: 'languages' },
  { word: 'CSS3', category: 'languages' },
  { word: 'Bash', category: 'languages' },
  { word: 'PHP', category: 'languages' },
  { word: 'Ruby', category: 'languages' },
  { word: 'Swift', category: 'languages' },
  { word: 'Kotlin', category: 'languages' },

  // Frameworks & Libraries
  { word: 'React', category: 'frameworks' },
  { word: 'Next.js', category: 'frameworks' },
  { word: 'Vue', category: 'frameworks' },
  { word: 'Angular', category: 'frameworks' },
  { word: 'Node.js', category: 'frameworks' },
  { word: 'Express', category: 'frameworks' },
  { word: 'NestJS', category: 'frameworks' },
  { word: 'Django', category: 'frameworks' },
  { word: 'FastAPI', category: 'frameworks' },
  { word: 'Flask', category: 'frameworks' },
  { word: 'Spring Boot', category: 'frameworks' },
  { word: 'Tailwind CSS', category: 'frameworks' },
  { word: 'Redux', category: 'frameworks' },
  { word: 'Zustand', category: 'frameworks' },
  { word: 'GraphQL', category: 'frameworks' },
  { word: 'REST API', category: 'frameworks' },
  { word: 'React Native', category: 'frameworks' },
  { word: 'Flutter', category: 'frameworks' },
  { word: 'PyTorch', category: 'frameworks' },
  { word: 'TensorFlow', category: 'frameworks' },
  { word: 'Pandas', category: 'frameworks' },

  // Tools & Platforms
  { word: 'Git', category: 'tools' },
  { word: 'GitHub', category: 'tools' },
  { word: 'Docker', category: 'tools' },
  { word: 'Kubernetes', category: 'tools' },
  { word: 'Webpack', category: 'tools' },
  { word: 'Vite', category: 'tools' },
  { word: 'Jest', category: 'tools' },
  { word: 'Cypress', category: 'tools' },
  { word: 'Playwright', category: 'tools' },
  { word: 'Linux', category: 'tools' },
  { word: 'Postman', category: 'tools' },
  { word: 'Figma', category: 'tools' },
  { word: 'Jira', category: 'tools' },

  // Cloud & Databases
  { word: 'AWS', category: 'cloud' },
  { word: 'Azure', category: 'cloud' },
  { word: 'GCP', category: 'cloud' },
  { word: 'PostgreSQL', category: 'cloud' },
  { word: 'MongoDB', category: 'cloud' },
  { word: 'MySQL', category: 'cloud' },
  { word: 'Redis', category: 'cloud' },
  { word: 'Kafka', category: 'cloud' },
  { word: 'Elasticsearch', category: 'cloud' },
  { word: 'Firebase', category: 'cloud' },
  { word: 'Terraform', category: 'cloud' },

  // Practices & Concepts
  { word: 'CI/CD', category: 'practices' },
  { word: 'Microservices', category: 'practices' },
  { word: 'System Design', category: 'practices' },
  { word: 'Agile', category: 'practices' },
  { word: 'Scrum', category: 'practices' },
  { word: 'Unit Testing', category: 'practices' },
  { word: 'TDD', category: 'practices' },
  { word: 'Performance Optimization', category: 'practices' },
  { word: 'Accessibility', category: 'practices' },
  { word: 'Responsive Design', category: 'practices' },
  { word: 'Security', category: 'practices' },
  { word: 'Clean Code', category: 'practices' },
  { word: 'Data Structures', category: 'concepts' },
  { word: 'Algorithms', category: 'concepts' },
  { word: 'Scalability', category: 'concepts' },
];

/**
 * Natural contextual placement generator for missing keywords
 */
function generateContextRecommendation(
  keyword: string,
  category: KeywordMatchItem['category']
): KeywordMatchItem['contextRecommendation'] {
  if (category === 'frameworks' || category === 'languages') {
    return {
      section: 'Skills',
      suggestion: `Add "${keyword}" under your Core Technical Skills & Frameworks list.`,
    };
  }
  if (category === 'tools' || category === 'cloud') {
    return {
      section: 'Experience',
      suggestion: `Highlight "${keyword}" in a bullet point: "Utilized ${keyword} for seamless deployment and workflow optimization."`,
    };
  }
  if (category === 'practices' || category === 'concepts') {
    return {
      section: 'Summary',
      suggestion: `Mention "${keyword}" in your Summary: "Experienced in delivering robust software with an emphasis on ${keyword}."`,
    };
  }
  return {
    section: 'Projects',
    suggestion: `Showcase "${keyword}" as a core technology badge in your primary technical project.`,
  };
}

/**
 * Deterministic Job Description Matching Engine
 */
export function analyzeJobMatch(resume: ResumeData, jobDescription: string): JobMatchAnalysis {
  const jd = (jobDescription || '').trim();
  if (!jd) {
    return {
      matchScore: 0,
      totalJDKeywords: 0,
      matchedCount: 0,
      missingCount: 0,
      matchedKeywords: [],
      missingKeywords: [],
      highPriorityMissing: [],
      importantSkills: [],
      recommendations: ['Paste a job description to perform deterministic keyword gap matching.'],
      targetRoleDetected: 'General Technical Role',
    };
  }

  const jdLower = jd.toLowerCase();
  const resumeText = extractResumeText(resume);

  // Extract all matched known keywords in JD with frequency
  const extractedKeywords: Array<{
    keyword: string;
    category: KeywordMatchItem['category'];
    freq: number;
    foundInResume: boolean;
  }> = [];

  for (const item of KNOWN_KEYWORDS) {
    const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Regex matching word boundary
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = jdLower.match(regex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      // Check if resume contains this keyword
      const resumeRegex = new RegExp(`\\b${escaped}\\b`, 'i');
      const foundInResume = resumeRegex.test(resumeText);

      extractedKeywords.push({
        keyword: item.word,
        category: item.category,
        freq: count,
        foundInResume,
      });
    }
  }

  // Also extract other prominent capitalized terms (e.g. specialized tools or names in JD)
  const additionalWords = jd.match(/\b[A-Z][a-zA-Z0-9+#.-]{2,}\b/g) || [];
  const commonStopWords = new Set([
    'The', 'We', 'You', 'Our', 'They', 'This', 'That', 'With', 'From', 'Have',
    'Are', 'Will', 'Must', 'Plus', 'Your', 'About', 'Team', 'Company', 'Role',
    'Experience', 'Years', 'Job', 'Work', 'Required', 'Preferred', 'Apply', 'Full',
    'Time', 'Benefits', 'Salary', 'Opportunity', 'Strong', 'Ability', 'Candidate'
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
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = jdLower.match(regex);
      const count = matches ? matches.length : 1;
      const foundInResume = new RegExp(`\\b${word}\\b`, 'i').test(resumeText);

      if (count >= 2) {
        extractedKeywords.push({
          keyword: word,
          category: 'tools',
          freq: count,
          foundInResume,
        });
      }
    }
  }

  // Sort by frequency descending
  extractedKeywords.sort((a, b) => b.freq - a.freq);

  const matchedKeywords: KeywordMatchItem[] = [];
  const missingKeywords: KeywordMatchItem[] = [];
  const highPriorityMissing: KeywordMatchItem[] = [];

  for (const item of extractedKeywords) {
    const isHighPriority = item.freq >= 2 || item.category === 'frameworks' || item.category === 'languages';
    const matchItem: KeywordMatchItem = {
      keyword: item.keyword,
      category: item.category,
      frequencyInJD: item.freq,
      foundInResume: item.foundInResume,
      isHighPriority,
      contextRecommendation: generateContextRecommendation(item.keyword, item.category),
    };

    if (item.foundInResume) {
      matchedKeywords.push(matchItem);
    } else {
      missingKeywords.push(matchItem);
      if (isHighPriority) {
        highPriorityMissing.push(matchItem);
      }
    }
  }

  // Deterministic score calculation
  const totalKeywords = extractedKeywords.length;
  let matchScore = 0;
  if (totalKeywords > 0) {
    // Weighted scoring: matched / total
    const rawRatio = matchedKeywords.length / totalKeywords;
    matchScore = Math.max(0, Math.min(100, Math.round(rawRatio * 100)));
  }

  // Detect likely target role from JD
  let targetRoleDetected = 'Software Engineer';
  if (/frontend|react|vue|angular|ui\/ux|web developer/i.test(jdLower)) {
    targetRoleDetected = 'Frontend Developer';
  } else if (/backend|api|database|microservices|spring|django|node/i.test(jdLower)) {
    targetRoleDetected = 'Backend Developer';
  } else if (/full stack|fullstack|mern|mean/i.test(jdLower)) {
    targetRoleDetected = 'Full Stack Developer';
  } else if (/devops|sre|kubernetes|docker|terraform|cloud engineer/i.test(jdLower)) {
    targetRoleDetected = 'DevOps / SRE Engineer';
  } else if (/data|analytics|pandas|python|machine learning|ai/i.test(jdLower)) {
    targetRoleDetected = 'Data & AI Engineer';
  }

  // Compile recommendations
  const recommendations: string[] = [];
  if (highPriorityMissing.length > 0) {
    const topMissing = highPriorityMissing.slice(0, 4).map((k) => k.keyword).join(', ');
    recommendations.push(`High priority: Incorporate key missing qualifications (${topMissing}) into your Skills or Experience bullets.`);
  }
  if (matchScore < 70) {
    recommendations.push(`Your match rate is ${matchScore}%. Review the missing technical keywords and add legitimate projects or experience using them.`);
  } else {
    recommendations.push(`Strong alignment with this posting (${matchScore}% match). Ensure your summary emphasizes your impact with these matched competencies.`);
  }

  if (matchedKeywords.length >= 8) {
    recommendations.push(`Excellent keyword coverage for ${targetRoleDetected}. Quantify your results where these technologies were applied.`);
  }

  const importantSkills = extractedKeywords.slice(0, 12).map((k) => k.keyword);

  return {
    matchScore,
    totalJDKeywords: totalKeywords,
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    matchedKeywords,
    missingKeywords,
    highPriorityMissing,
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
