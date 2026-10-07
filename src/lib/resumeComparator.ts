import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult } from './atsEngine';

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
  const breakdownA = analysisA.breakdown;
  const breakdownB = analysisB.breakdown;

  const sectionsToCompare: Array<keyof typeof breakdownA> = [
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

  sectionsToCompare.forEach((key) => {
    const secA = breakdownA[key];
    const secB = breakdownB[key];
    const diff = secB.score - secA.score;

    if (diff > 0) {
      improvedSections.push({
        name: secB.label,
        diff,
        feedback: secB.feedback,
      });
    } else if (diff < 0) {
      weakerSections.push({
        name: secB.label,
        diff,
        feedback: secB.feedback,
      });
    } else {
      unchangedSections.push({
        name: secB.label,
        score: secB.score,
      });
    }
  });

  return {
    scoreA,
    scoreB,
    scoreDiff,
    statusA: analysisA.status,
    statusB: analysisB.status,
    skillsAdded,
    skillsRemoved,
    skillsCommon,
    experienceCountA: resumeA.experiences?.length || 0,
    experienceCountB: resumeB.experiences?.length || 0,
    projectsCountA: resumeA.projects?.length || 0,
    projectsCountB: resumeB.projects?.length || 0,
    educationCountA: resumeA.education?.length || 0,
    educationCountB: resumeB.education?.length || 0,
    improvedSections,
    weakerSections,
    unchangedSections,
    analysisA,
    analysisB,
  };
}
