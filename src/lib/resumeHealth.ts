import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult } from './atsEngine';
import { analyzeJobMatch, JobMatchAnalysis } from './jobMatcher';

export interface HealthPillar {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  feedback: string;
  actionableHint: string;
}

export interface ReadinessChecklistItem {
  id: string;
  label: string;
  status: 'passed' | 'warning' | 'failed';
  detail: string;
  recommendation?: string;
  actionTarget?: 'contact' | 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'ats';
}

export interface ResumeHealthAnalysis {
  overallHealthScore: number;
  atsScore: number;
  jobMatchScore: number | null;
  readinessScore: number;
  pillars: {
    contentQuality: HealthPillar;
    keywordMatch: HealthPillar;
    completeness: HealthPillar;
    formatting: HealthPillar;
    impact: HealthPillar;
    contactLinks: HealthPillar;
  };
  readinessChecklist: ReadinessChecklistItem[];
  strengths: string[];
  weaknesses: string[];
  topRecommendations: string[];
}

export function analyzeResumeHealth(
  resume: ResumeData,
  targetRole = 'Full Stack Developer',
  jobDescription?: string
): ResumeHealthAnalysis {
  const atsResult: ATSAnalysisResult = calculateATSScore(resume, targetRole);
  const jbResult: JobMatchAnalysis | null = jobDescription ? analyzeJobMatch(resume, jobDescription) : null;

  const { breakdown } = atsResult;

  // 1. Completeness Pillar (Are standard sections populated?)
  let completenessScore = 0;
  if (resume.fullName && resume.email) completenessScore += 20;
  if (resume.summary && resume.summary.length > 30) completenessScore += 20;
  if (resume.skills && resume.skills.length >= 5) completenessScore += 20;
  if (resume.experiences && resume.experiences.length >= 1) completenessScore += 20;
  if (resume.education && resume.education.length >= 1) completenessScore += 10;
  if (resume.projects && resume.projects.length >= 1) completenessScore += 10;
  completenessScore = Math.min(100, completenessScore);

  // 2. Impact Pillar (Quantifiable metrics %, $, numbers, action verbs)
  let impactScore = 20;
  let metricFound = 0;
  (resume.experiences || []).forEach((exp) => {
    if (/(\d+[%kKmMbB+]|\$\d+|\b\d+\s*(?:percent|users|requests|ms|seconds|x|times)\b)/i.test(exp.description)) {
      metricFound++;
    }
  });
  if (metricFound >= 3) impactScore += 80;
  else if (metricFound >= 2) impactScore += 60;
  else if (metricFound >= 1) impactScore += 40;
  else if ((resume.experiences || []).length > 0) impactScore += 20;
  impactScore = Math.min(100, impactScore);

  // 3. Content Quality (Summary strength, word density, lack of filler words)
  let qualityScore = 50;
  if (resume.summary && resume.summary.length > 50) qualityScore += 25;
  if (breakdown.experienceProjects.score >= 10) qualityScore += 25;
  qualityScore = Math.min(100, qualityScore);

  // 4. Keyword Match Pillar
  let keywordScore = Math.round((breakdown.keywordMatch.score / breakdown.keywordMatch.max) * 100);
  if (jbResult && jbResult.totalJDKeywords > 0) {
    keywordScore = Math.round((keywordScore + jbResult.matchScore) / 2);
  }

  // 5. Formatting & ATS Layout
  const formattingScore = Math.round((breakdown.atsFormatting.score / breakdown.atsFormatting.max) * 100);

  // 6. Contact & Professional Links
  let contactScore = 0;
  if (resume.fullName && resume.email) contactScore += 50;
  if (resume.phone) contactScore += 25;
  if (resume.linkedin || resume.github || resume.portfolio) contactScore += 25;

  // Overall Composite Health Score
  const overallHealthScore = Math.round(
    completenessScore * 0.25 +
    impactScore * 0.20 +
    qualityScore * 0.15 +
    keywordScore * 0.15 +
    formattingScore * 0.15 +
    contactScore * 0.10
  );

  // Readiness Checklist Items
  const checklist: ReadinessChecklistItem[] = [
    {
      id: 'contact',
      label: 'Contact Information',
      status: contactScore >= 80 ? 'passed' : contactScore >= 50 ? 'warning' : 'failed',
      detail: contactScore >= 80 ? 'Full contact details with phone and active profiles.' : 'Add phone number, LinkedIn, and GitHub profile.',
      recommendation: 'Ensure your phone number and portfolio links are accurate.',
      actionTarget: 'contact',
    },
    {
      id: 'summary',
      label: 'Professional Summary',
      status: breakdown.summary.score >= 7 ? 'passed' : breakdown.summary.score >= 4 ? 'warning' : 'failed',
      detail: breakdown.summary.score >= 7 ? 'Concise, high-impact executive summary.' : 'Expand your summary with core technical competencies.',
      recommendation: 'Use the Content Assistant to rewrite your summary with executive tone.',
      actionTarget: 'summary',
    },
    {
      id: 'skills',
      label: 'Technical Skills Inventory',
      status: breakdown.skills.score >= 12 ? 'passed' : breakdown.skills.score >= 8 ? 'warning' : 'failed',
      detail: `${resume.skills?.length || 0} skills documented across technical categories.`,
      recommendation: 'Group skills by languages, frameworks, and cloud developer tools.',
      actionTarget: 'skills',
    },
    {
      id: 'experience',
      label: 'Professional Work Experience',
      status: breakdown.experience.score >= 15 ? 'passed' : breakdown.experience.score >= 8 ? 'warning' : 'failed',
      detail: `${resume.experiences?.length || 0} verified positions recorded.`,
      recommendation: 'Focus bullet points on results delivered rather than routine tasks.',
      actionTarget: 'experience',
    },
    {
      id: 'projects',
      label: 'Technical Projects',
      status: breakdown.projects.score >= 12 ? 'passed' : breakdown.projects.score >= 6 ? 'warning' : 'failed',
      detail: `${resume.projects?.length || 0} substantive projects with defined tech stacks.`,
      recommendation: 'Highlight projects demonstrating architecture and deployment.',
      actionTarget: 'projects',
    },
    {
      id: 'education',
      label: 'Education Accreditation',
      status: breakdown.education.score >= 8 ? 'passed' : breakdown.education.score >= 4 ? 'warning' : 'failed',
      detail: breakdown.education.score >= 8 ? 'Degree, institution, and graduation timeline listed.' : 'Include degree details and graduation year.',
      recommendation: 'Add major, degree type, and relevant coursework.',
      actionTarget: 'education',
    },
    {
      id: 'impact',
      label: 'Measurable Achievements & Metrics',
      status: impactScore >= 75 ? 'passed' : impactScore >= 40 ? 'warning' : 'failed',
      detail: metricFound > 0 ? `${metricFound} quantifiable metrics (%, $, numbers) detected.` : 'Lacks measurable achievements.',
      recommendation: 'Add quantifiable results (e.g., "reduced latency by 40%", "served 100K+ requests").',
      actionTarget: 'experience',
    },
    {
      id: 'ats',
      label: 'ATS Compatibility & Structure',
      status: formattingScore >= 80 ? 'passed' : 'warning',
      detail: 'Standard single-column hierarchy optimized for parser ingestion.',
      recommendation: 'Keep layout clean with standard bullet formatting.',
      actionTarget: 'ats',
    },
    {
      id: 'keywords',
      label: 'Keyword Optimization',
      status: keywordScore >= 70 ? 'passed' : keywordScore >= 45 ? 'warning' : 'failed',
      detail: `${breakdown.keywords.feedback}.`,
      recommendation: 'Use the Job Description Matcher to identify missing role keywords.',
      actionTarget: 'skills',
    },
  ];

  // Calculate Readiness Score based on checklist
  const passedCount = checklist.filter((c) => c.status === 'passed').length;
  const warningCount = checklist.filter((c) => c.status === 'warning').length;
  const readinessScore = Math.round((passedCount * 11 + warningCount * 5.5));

  const pillars = {
    contentQuality: {
      id: 'quality',
      name: 'Content Quality',
      score: qualityScore,
      weight: 15,
      status: qualityScore >= 80 ? 'excellent' : qualityScore >= 60 ? 'good' : 'warning',
      feedback: qualityScore >= 80 ? 'Well-articulated descriptions and professional phrasing.' : 'Refine descriptions with stronger action verbs and concise phrasing.',
      actionableHint: 'Use the Content Assistant to rewrite weak bullets.',
    },
    keywordMatch: {
      id: 'keyword',
      name: 'Keyword Match',
      score: keywordScore,
      weight: 15,
      status: keywordScore >= 75 ? 'excellent' : keywordScore >= 55 ? 'good' : 'warning',
      feedback: `${breakdown.keywords.feedback}.`,
      actionableHint: 'Review missing keywords in the Keyword Gap Analyzer.',
    },
    completeness: {
      id: 'completeness',
      name: 'Completeness',
      score: completenessScore,
      weight: 25,
      status: completenessScore >= 85 ? 'excellent' : completenessScore >= 65 ? 'good' : 'warning',
      feedback: completenessScore >= 85 ? 'All primary resume sections are thoroughly populated.' : 'Add missing sections to achieve full resume coverage.',
      actionableHint: 'Ensure projects, education, and certifications are filled out.',
    },
    formatting: {
      id: 'formatting',
      name: 'Formatting & Layout',
      score: formattingScore,
      weight: 15,
      status: formattingScore >= 80 ? 'excellent' : 'good',
      feedback: 'Single-column ATS layout compliant with recruiting scanning systems.',
      actionableHint: 'Selected LaTeX/Overleaf templates provide verified ATS alignment.',
    },
    impact: {
      id: 'impact',
      name: 'Quantifiable Impact',
      score: impactScore,
      weight: 20,
      status: impactScore >= 75 ? 'excellent' : impactScore >= 45 ? 'good' : 'warning',
      feedback: impactScore >= 75 ? 'Bullet points demonstrate strong business metrics and results.' : 'Incorporate more numbers, percentages, and quantifiable achievements.',
      actionableHint: 'Add performance metrics or scale numbers to your experience bullets.',
    },
    contactLinks: {
      id: 'contact',
      name: 'Contact & Links',
      score: contactScore,
      weight: 10,
      status: contactScore >= 80 ? 'excellent' : contactScore >= 50 ? 'good' : 'warning',
      feedback: contactScore >= 80 ? 'Complete contact details and verified professional profiles.' : 'Include direct communication channels and GitHub / LinkedIn links.',
      actionableHint: 'Add your LinkedIn and portfolio URL.',
    },
  } as const;

  const topRecommendations: string[] = [];
  checklist.forEach((item) => {
    if (item.status !== 'passed' && item.recommendation) {
      topRecommendations.push(item.recommendation);
    }
  });

  return {
    overallHealthScore,
    atsScore: atsResult.score,
    jobMatchScore: jbResult ? jbResult.matchScore : null,
    readinessScore: Math.min(100, readinessScore),
    pillars,
    readinessChecklist: checklist,
    strengths: atsResult.strengths,
    weaknesses: atsResult.weaknesses,
    topRecommendations: topRecommendations.slice(0, 5),
  };
}
