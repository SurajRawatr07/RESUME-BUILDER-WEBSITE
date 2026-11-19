import { ResumeData } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult, toCleanStringArray } from './atsEngine';
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
  issuesDetected: string[];
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
  const jbResult: JobMatchAnalysis | null =
    jobDescription && jobDescription.trim().length > 20 ? analyzeJobMatch(resume, jobDescription) : null;

  const { breakdown } = atsResult;
  const issuesDetected: string[] = [];

  const skillsList = [...toCleanStringArray(resume.skills), ...toCleanStringArray(resume.technologies)];
  const experiences = Array.isArray(resume.experiences) ? resume.experiences : [];
  const projects = Array.isArray(resume.projects) ? resume.projects : [];
  const education = Array.isArray(resume.education) ? resume.education : [];
  const summaryText = (resume.summary || resume.aboutMe || '').trim();

  // Check duplicates
  const skillKeys = skillsList.map((s) => s.toLowerCase().trim());
  const duplicateSkillsCount = skillKeys.length - new Set(skillKeys).size;
  if (duplicateSkillsCount > 0) {
    issuesDetected.push(`${duplicateSkillsCount} duplicate skill entry(ies) found`);
  }

  const expKeys = experiences.map((e) => `${(e.jobTitle || '').trim().toLowerCase()}|${(e.company || '').trim().toLowerCase()}`);
  const duplicateExpsCount = expKeys.length - new Set(expKeys).size;
  if (duplicateExpsCount > 0) {
    issuesDetected.push('Duplicate experience role/company entries detected');
  }

  // Check empty/incomplete subfields
  const emptyExpFields = experiences.filter((e) => !e.jobTitle?.trim() || !e.company?.trim() || !e.description?.trim()).length;
  if (emptyExpFields > 0) {
    issuesDetected.push(`${emptyExpFields} experience entry(ies) have empty title, company, or description`);
  }

  const emptyEduFields = education.filter((e) => !e.degree?.trim() || !e.institution?.trim()).length;
  if (emptyEduFields > 0) {
    issuesDetected.push(`${emptyEduFields} education entry(ies) missing degree or institution`);
  }

  const emptyProjFields = projects.filter((p) => !p.title?.trim() || !p.description?.trim()).length;
  if (emptyProjFields > 0) {
    issuesDetected.push(`${emptyProjFields} project entry(ies) missing title or description`);
  }

  // Check formatting inconsistencies (mixed dates, weak passive phrasing, decorative characters)
  const expDates = experiences.map((e) => (e.startDate || '').trim()).filter(Boolean);
  const hasNumericDates = expDates.some((d) => /^\d{2}\/\d{4}$/.test(d));
  const hasMonthTextDates = expDates.some((d) => /^[A-Za-z]+\s+\d{4}$/.test(d));
  const hasYearOnlyDates = expDates.some((d) => /^\d{4}$/.test(d));
  const dateStyleCount = [hasNumericDates, hasMonthTextDates, hasYearOnlyDates].filter(Boolean).length;
  if (dateStyleCount > 1) {
    issuesDetected.push('Inconsistent date formats used across experience entries');
  }

  const combinedDesc = [summaryText, ...experiences.map((e) => e.description || ''), ...projects.map((p) => p.description || '')].join(' ');
  const hasWeakPhrasing = /\b(responsible for|worked on|helped with|a lot of|fixed bugs)\b/i.test(combinedDesc);
  if (hasWeakPhrasing) {
    issuesDetected.push('Weak or passive phrasing detected (e.g., "responsible for", "worked on")');
  }

  // 1. Completeness Pillar
  let completenessScore = 0;
  if (resume.fullName?.trim() && resume.email?.trim()) completenessScore += 20;
  if (summaryText.length > 30) completenessScore += 20;
  if (skillsList.length >= 5) completenessScore += 20;
  if (experiences.length >= 1) completenessScore += 20;
  if (education.length >= 1) completenessScore += 10;
  if (projects.length >= 1) completenessScore += 10;
  if (emptyExpFields > 0 || emptyEduFields > 0 || emptyProjFields > 0) {
    completenessScore = Math.max(0, completenessScore - 10);
  }
  completenessScore = Math.min(100, completenessScore);

  // 2. Impact Pillar
  let impactScore = 20;
  let metricFound = 0;
  experiences.forEach((exp) => {
    if (/(\d+[%kKmMbB+]|\$\d+|\b\d+\s*(?:percent|users|requests|ms|seconds|x|times)\b)/i.test(exp.description || '')) {
      metricFound++;
    }
  });
  if (metricFound >= 3) impactScore += 80;
  else if (metricFound >= 2) impactScore += 60;
  else if (metricFound >= 1) impactScore += 40;
  else if (experiences.length > 0) impactScore += 20;
  if (hasWeakPhrasing) impactScore = Math.max(15, impactScore - 15);
  impactScore = Math.min(100, impactScore);

  // 3. Content Quality
  let qualityScore = 40;
  if (summaryText.length > 50) qualityScore += 25;
  if (breakdown.experienceProjects.score >= 10) qualityScore += 25;
  if (!hasWeakPhrasing) qualityScore += 10;
  qualityScore = Math.min(100, qualityScore);

  // 4. Keyword Match Pillar
  let keywordScore = Math.round((breakdown.keywordMatch.score / breakdown.keywordMatch.max) * 100);
  if (jbResult && jbResult.isValidJD && jbResult.totalJDKeywords > 0) {
    keywordScore = Math.round((keywordScore + jbResult.matchScore) / 2);
  }

  // 5. Formatting & Organization
  let formattingScore = Math.round((breakdown.atsFormatting.score / breakdown.atsFormatting.max) * 100);
  if (duplicateSkillsCount > 0 || duplicateExpsCount > 0) formattingScore = Math.max(20, formattingScore - 15);
  if (dateStyleCount > 1) formattingScore = Math.max(20, formattingScore - 10);

  // 6. Contact & Professional Links
  let contactScore = 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((resume.email || '').trim());
  if (resume.fullName?.trim() && emailValid) contactScore += 45;
  if (resume.phone?.trim()) contactScore += 20;
  if (resume.location?.trim()) contactScore += 15;
  if (resume.linkedin?.trim() || resume.github?.trim() || resume.portfolio?.trim() || resume.website?.trim()) {
    contactScore += 20;
  }

  const overallHealthScore = Math.round(
    completenessScore * 0.25 +
    impactScore * 0.20 +
    qualityScore * 0.15 +
    keywordScore * 0.15 +
    formattingScore * 0.15 +
    contactScore * 0.10
  );

  const summaryBreakdownScore = breakdown.summary?.score ?? Math.round((breakdown.jobTitleRelevance.score / 20) * 10);
  const skillsBreakdownScore = breakdown.skills?.score ?? Math.round((breakdown.keywordMatch.score / 30) * 15);
  const experienceBreakdownScore = breakdown.experience?.score ?? breakdown.experienceProjects.score;
  const projectsBreakdownScore = breakdown.projects?.score ?? breakdown.experienceProjects.score;
  const educationBreakdownScore = breakdown.education?.score ?? breakdown.educationCertifications.score;
  const keywordsFeedback = breakdown.keywords?.feedback || breakdown.keywordMatch.feedback;

  const checklist: ReadinessChecklistItem[] = [
    {
      id: 'contact',
      label: 'Contact Information',
      status: contactScore >= 80 ? 'passed' : contactScore >= 50 ? 'warning' : 'failed',
      detail: contactScore >= 80
        ? 'Full contact header with valid email, phone, location, and profile links.'
        : 'Missing email, phone number, location, or professional links.',
      recommendation: 'Complete your name, valid email, phone, location, and LinkedIn/GitHub URL.',
      actionTarget: 'contact',
    },
    {
      id: 'summary',
      label: 'Professional Summary',
      status: summaryText.length >= 60 && summaryBreakdownScore >= 6 ? 'passed' : summaryText.length > 0 ? 'warning' : 'failed',
      detail: summaryText.length >= 60 ? 'Concise summary populated.' : summaryText.length > 0 ? 'Summary is brief.' : 'Missing professional summary.',
      recommendation: 'Use the Content Assistant to refine your summary concisely.',
      actionTarget: 'summary',
    },
    {
      id: 'skills',
      label: 'Technical Skills & Duplicates',
      status: duplicateSkillsCount === 0 && skillsList.length >= 6 && skillsBreakdownScore >= 10 ? 'passed' : skillsList.length > 0 ? 'warning' : 'failed',
      detail: duplicateSkillsCount > 0
        ? `${duplicateSkillsCount} duplicate skill(s) detected across ${skillsList.length} entries.`
        : `${skillsList.length} unique technical skills documented.`,
      recommendation: duplicateSkillsCount > 0 ? 'Remove duplicate skills using Content Assistant or Skills editor.' : 'List your verified technical skills clearly.',
      actionTarget: 'skills',
    },
    {
      id: 'experience',
      label: 'Experience Completeness',
      status: experiences.length > 0 && emptyExpFields === 0 && duplicateExpsCount === 0 && experienceBreakdownScore >= 10
        ? 'passed'
        : experiences.length > 0 ? 'warning' : 'failed',
      detail: emptyExpFields > 0
        ? `${emptyExpFields} entry(ies) missing required title, company, or description.`
        : `${experiences.length} experience position(s) recorded.`,
      recommendation: 'Ensure each role includes title, company, consistent dates, and clear bullet points.',
      actionTarget: 'experience',
    },
    {
      id: 'projects',
      label: 'Technical Projects',
      status: projects.length > 0 && emptyProjFields === 0 && projectsBreakdownScore >= 8 ? 'passed' : projects.length > 0 ? 'warning' : 'failed',
      detail: emptyProjFields > 0
        ? `${emptyProjFields} project(s) have empty title or description.`
        : `${projects.length} project(s) documented.`,
      recommendation: 'Include concrete tech stacks and outcomes for your projects.',
      actionTarget: 'projects',
    },
    {
      id: 'education',
      label: 'Education Details',
      status: education.length > 0 && emptyEduFields === 0 && educationBreakdownScore >= 6 ? 'passed' : education.length > 0 ? 'warning' : 'failed',
      detail: emptyEduFields > 0
        ? `${emptyEduFields} education entry(ies) missing degree or institution.`
        : education.length > 0 ? 'Degree, institution, and graduation dates present.' : 'No education entry added.',
      recommendation: 'Verify degree name, institution, and graduation date.',
      actionTarget: 'education',
    },
    {
      id: 'consistency',
      label: 'Formatting & Phrasing Consistency',
      status: dateStyleCount <= 1 && !hasWeakPhrasing && formattingScore >= 80 ? 'passed' : 'warning',
      detail: issuesDetected.length > 0
        ? issuesDetected[0]
        : 'Consistent date formatting, clean bullets, and strong active voice.',
      recommendation: 'Standardize date formats across roles and replace passive phrases ("worked on", "responsible for").',
      actionTarget: 'ats',
    },
    {
      id: 'impact',
      label: 'Measurable Results',
      status: impactScore >= 75 ? 'passed' : impactScore >= 40 ? 'warning' : 'failed',
      detail: metricFound > 0 ? `${metricFound} role(s) include quantifiable metrics.` : 'Few quantifiable results detected.',
      recommendation: 'Add real scale, performance, or user metrics where applicable.',
      actionTarget: 'experience',
    },
    {
      id: 'keywords',
      label: 'Role & JD Keyword Alignment',
      status: keywordScore >= 70 ? 'passed' : keywordScore >= 45 ? 'warning' : 'failed',
      detail: `${keywordsFeedback}.`,
      recommendation: 'Use the JD Matcher and Keyword Gap tabs to compare against target job postings.',
      actionTarget: 'skills',
    },
  ];

  const passedCount = checklist.filter((c) => c.status === 'passed').length;
  const warningCount = checklist.filter((c) => c.status === 'warning').length;
  const readinessScore = Math.min(100, Math.round((passedCount / checklist.length) * 100 - warningCount * 4));

  const pillars = {
    contentQuality: {
      id: 'quality',
      name: 'Content Quality',
      score: qualityScore,
      weight: 15,
      status: qualityScore >= 80 ? 'excellent' : qualityScore >= 60 ? 'good' : 'warning',
      feedback: hasWeakPhrasing
        ? 'Passive phrases detected ("responsible for" / "worked on").'
        : qualityScore >= 80
        ? 'Clear, direct active-voice descriptions.'
        : 'Add more specific engineering detail to your summary and experience.',
      actionableHint: 'Use Content Assistant to refine weak phrasing.',
    },
    keywordMatch: {
      id: 'keyword',
      name: 'Keyword Alignment',
      score: keywordScore,
      weight: 15,
      status: keywordScore >= 75 ? 'excellent' : keywordScore >= 55 ? 'good' : 'warning',
      feedback: `${keywordsFeedback}.`,
      actionableHint: 'Compare against target postings in Keyword Gap.',
    },
    completeness: {
      id: 'completeness',
      name: 'Section Completeness',
      score: completenessScore,
      weight: 25,
      status: completenessScore >= 85 ? 'excellent' : completenessScore >= 65 ? 'good' : 'warning',
      feedback: emptyExpFields + emptyEduFields + emptyProjFields > 0
        ? 'Some resume entries contain empty fields.'
        : completenessScore >= 85
        ? 'All core resume sections are populated cleanly.'
        : 'Add missing resume sections for complete coverage.',
      actionableHint: 'Verify Contact, Summary, Skills, Experience, and Education.',
    },
    formatting: {
      id: 'formatting',
      name: 'Consistency & Structure',
      score: formattingScore,
      weight: 15,
      status: formattingScore >= 80 ? 'excellent' : formattingScore >= 60 ? 'good' : 'warning',
      feedback: issuesDetected.length > 0
        ? `${issuesDetected.length} structural/consistency issue(s) flagged.`
        : 'No duplicate entries or formatting inconsistencies detected.',
      actionableHint: 'Keep dates uniform and avoid duplicate skill tags.',
    },
    impact: {
      id: 'impact',
      name: 'Measurable Impact',
      score: impactScore,
      weight: 20,
      status: impactScore >= 75 ? 'excellent' : impactScore >= 45 ? 'good' : 'warning',
      feedback: impactScore >= 75
        ? 'Experience bullets highlight concrete numbers and scale.'
        : 'Add verifiable results, scale, or latency outcomes where accurate.',
      actionableHint: 'Quantify real achievements in your bullets.',
    },
    contactLinks: {
      id: 'contact',
      name: 'Contact & Profiles',
      score: contactScore,
      weight: 10,
      status: contactScore >= 80 ? 'excellent' : contactScore >= 50 ? 'good' : 'warning',
      feedback: contactScore >= 80
        ? 'Complete contact details and clickable links provided.'
        : 'Include valid email, phone, location, and GitHub/LinkedIn.',
      actionableHint: 'Update Personal Information in the editor.',
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
    jobMatchScore: jbResult && jbResult.isValidJD ? jbResult.matchScore : null,
    readinessScore: Math.max(0, readinessScore),
    issuesDetected,
    pillars,
    readinessChecklist: checklist,
    strengths: atsResult.strengths,
    weaknesses: atsResult.weaknesses,
    topRecommendations: topRecommendations.slice(0, 5),
  };
}
