import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult, ATSBreakdown } from './atsEngine';

export interface ResumeComparisonResult {
  scoreA: number;
  scoreB: number;
  scoreDiff: number;
  statusA: string;
  statusB: string;
  skillsAdded: string[];
  skillsRemoved: string[];
  skillsCommon: string[];
  experienceCountA: number;
  experienceCountB: number;
  projectsCountA: number;
  projectsCountB: number;
  educationCountA: number;
  educationCountB: number;
  improvedSections: Array<{ name: string; diff: number; feedback: string }>;
  weakerSections: Array<{ name: string; diff: number; feedback: string }>;
  unchangedSections: Array<{ name: string; score: number }>;
  analysisA: ATSAnalysisResult;
  analysisB: ATSAnalysisResult;
}

export function compareTwoResumes(
  resumeA: ResumeData,
  resumeB: ResumeData,
  targetRole = 'Full Stack Developer'
): ResumeComparisonResult {
  const analysisA = calculateATSScore(resumeA, targetRole);
  const analysisB = calculateATSScore(resumeB, targetRole);

  const scoreA = analysisA.score;
  const scoreB = analysisB.score;
  const scoreDiff = scoreB - scoreA;

  // Skills Diff
  const extractSkills = (r?: ResumeData): string[] => {
    if (!r) return [];
    const skills = Array.isArray(r.skills) ? r.skills : (typeof r.skills === 'string' ? [r.skills] : []);
    const techs = Array.isArray(r.technologies) ? r.technologies : (typeof r.technologies === 'string' ? [r.technologies] : []);
    return [...skills, ...techs].map((s) => String(s).trim()).filter(Boolean);
  };

  const listA = extractSkills(resumeA);
  const listB = extractSkills(resumeB);

  const skillsA = new Set(listA.map((s) => s.toLowerCase()));
  const skillsB = new Set(listB.map((s) => s.toLowerCase()));

  const skillsAdded = listB.filter((s) => !skillsA.has(s.toLowerCase()));
  const skillsRemoved = listA.filter((s) => !skillsB.has(s.toLowerCase()));
  const skillsCommon = listB.filter((s) => skillsA.has(s.toLowerCase()));

  // Section-by-section comparison
  const breakdownA = analysisA?.breakdown || {};
  const breakdownB = analysisB?.breakdown || {};

  const sectionsToCompare: Array<keyof ATSBreakdown> = [
    'jobTitleRelevance',
    'keywordMatch',
    'contentCompleteness',
    'experienceProjects',
    'educationCertifications',
    'atsFormatting',
  ];

  const improvedSections: ResumeComparisonResult['improvedSections'] = [];
  const weakerSections: ResumeComparisonResult['weakerSections'] = [];
  const unchangedSections: ResumeComparisonResult['unchangedSections'] = [];

  const breakdownARecord = breakdownA as Record<string, { score?: number; label?: string; feedback?: string } | undefined>;
  const breakdownBRecord = breakdownB as Record<string, { score?: number; label?: string; feedback?: string } | undefined>;

  sectionsToCompare.forEach((key) => {
    const secA = breakdownARecord[key] || { score: 0, label: String(key), feedback: '' };
    const secB = breakdownBRecord[key] || { score: 0, label: String(key), feedback: '' };
    const diff = (secB.score || 0) - (secA.score || 0);

    if (diff > 0) {
      improvedSections.push({
        name: secB.label || String(key),
        diff,
        feedback: secB.feedback || '',
      });
    } else if (diff < 0) {
      weakerSections.push({
        name: secB.label || String(key),
        diff,
        feedback: secB.feedback || '',
      });
    } else {
      unchangedSections.push({
        name: secB.label || String(key),
        score: secB.score || 0,
      });
    }
  });

  return {
    scoreA: analysisA?.score || 0,
    scoreB: analysisB?.score || 0,
    scoreDiff: (analysisB?.score || 0) - (analysisA?.score || 0),
    statusA: analysisA?.status || 'Good',
    statusB: analysisB?.status || 'Good',
    skillsAdded,
    skillsRemoved,
    skillsCommon,
    experienceCountA: resumeA?.experiences?.length || 0,
    experienceCountB: resumeB?.experiences?.length || 0,
    projectsCountA: resumeA?.projects?.length || 0,
    projectsCountB: resumeB?.projects?.length || 0,
    educationCountA: resumeA?.education?.length || 0,
    educationCountB: resumeB?.education?.length || 0,
    improvedSections,
    weakerSections,
    unchangedSections,
    analysisA,
    analysisB,
  };
}
