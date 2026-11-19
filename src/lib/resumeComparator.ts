import { ResumeData, Experience, Project, Education, Certification } from '@/types/resume';
import { calculateATSScore, ATSAnalysisResult, ATSBreakdown, toCleanStringArray } from './atsEngine';

export interface FieldDiffItem {
  label: string;
  changeType: 'added' | 'removed' | 'modified';
  before?: string;
  after?: string;
}

export interface SectionContentDiff {
  id: string;
  sectionName: string;
  status: 'identical' | 'added' | 'removed' | 'modified';
  summaryText: string;
  changes: FieldDiffItem[];
}

export interface ResumeComparisonResult {
  isIdentical: boolean;
  totalSectionChanges: number;
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
  sectionDiffs: SectionContentDiff[];
  improvedSections: Array<{ name: string; diff: number; feedback: string }>;
  weakerSections: Array<{ name: string; diff: number; feedback: string }>;
  unchangedSections: Array<{ name: string; score: number }>;
  analysisA: ATSAnalysisResult;
  analysisB: ATSAnalysisResult;
}

function normStr(val?: string | null): string {
  return (val || '').trim();
}

function serializeExp(exp: Experience): string {
  return `${normStr(exp.jobTitle)} at ${normStr(exp.company)} (${normStr(exp.startDate)} - ${exp.current ? 'Present' : normStr(exp.endDate)})\n${normStr(exp.description)}`;
}

function serializeProj(proj: Project): string {
  return `${normStr(proj.title)}${proj.technologies ? ` [${normStr(proj.technologies)}]` : ''}\n${normStr(proj.description)}`;
}

function serializeEdu(edu: Education): string {
  return `${normStr(edu.degree)} — ${normStr(edu.institution)} (${normStr(edu.graduationDate)})`;
}

function serializeCert(cert: Certification): string {
  return `${normStr(cert.name)}${cert.issuer ? ` — ${normStr(cert.issuer)}` : ''}${cert.date ? ` (${normStr(cert.date)})` : ''}`;
}

export function compareTwoResumes(
  resumeAInput: ResumeData | undefined,
  resumeBInput: ResumeData | undefined,
  targetRole = 'Full Stack Developer'
): ResumeComparisonResult {
  const resumeA = (resumeAInput || {}) as ResumeData;
  const resumeB = (resumeBInput || {}) as ResumeData;

  const analysisA = calculateATSScore(resumeA, targetRole);
  const analysisB = calculateATSScore(resumeB, targetRole);

  // Skills Diff
  const extractSkills = (r: ResumeData): string[] => {
    const skills = toCleanStringArray(r.skills);
    const techs = toCleanStringArray(r.technologies);
    const seen = new Set<string>();
    const combined: string[] = [];
    for (const s of [...skills, ...techs]) {
      const k = s.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        combined.push(s);
      }
    }
    return combined;
  };

  const listA = extractSkills(resumeA);
  const listB = extractSkills(resumeB);

  const skillsA = new Set(listA.map((s) => s.toLowerCase()));
  const skillsB = new Set(listB.map((s) => s.toLowerCase()));

  const skillsAdded = listB.filter((s) => !skillsA.has(s.toLowerCase()));
  const skillsRemoved = listA.filter((s) => !skillsB.has(s.toLowerCase()));
  const skillsCommon = listB.filter((s) => skillsA.has(s.toLowerCase()));

  // Section-by-section real content diffs
  const sectionDiffs: SectionContentDiff[] = [];

  // 1. Header & Contact Info
  const contactChanges: FieldDiffItem[] = [];
  const contactFields: Array<[string, string | undefined, string | undefined]> = [
    ['Full Name', resumeA.fullName, resumeB.fullName],
    ['Target Title', resumeA.jobTitle, resumeB.jobTitle],
    ['Email', resumeA.email, resumeB.email],
    ['Phone', resumeA.phone, resumeB.phone],
    ['Location', resumeA.location, resumeB.location],
    ['LinkedIn', resumeA.linkedin, resumeB.linkedin],
    ['GitHub', resumeA.github, resumeB.github],
    ['Portfolio / Website', resumeA.portfolio || resumeA.website, resumeB.portfolio || resumeB.website],
  ];
  for (const [label, aVal, bVal] of contactFields) {
    const aClean = normStr(aVal);
    const bClean = normStr(bVal);
    if (aClean !== bClean) {
      if (!aClean && bClean) {
        contactChanges.push({ label, changeType: 'added', after: bClean });
      } else if (aClean && !bClean) {
        contactChanges.push({ label, changeType: 'removed', before: aClean });
      } else {
        contactChanges.push({ label, changeType: 'modified', before: aClean, after: bClean });
      }
    }
  }
  sectionDiffs.push({
    id: 'contact',
    sectionName: 'Header & Contact Details',
    status: contactChanges.length === 0 ? 'identical' : 'modified',
    summaryText: contactChanges.length === 0 ? 'Identical across both versions' : `${contactChanges.length} field(s) changed`,
    changes: contactChanges,
  });

  // 2. Summary
  const sumA = normStr(resumeA.summary || resumeA.aboutMe);
  const sumB = normStr(resumeB.summary || resumeB.aboutMe);
  if (sumA === sumB) {
    sectionDiffs.push({
      id: 'summary',
      sectionName: 'Professional Summary',
      status: 'identical',
      summaryText: sumA ? 'Identical summary text' : 'Not present in either version',
      changes: [],
    });
  } else {
    const changeType: FieldDiffItem['changeType'] = !sumA ? 'added' : !sumB ? 'removed' : 'modified';
    sectionDiffs.push({
      id: 'summary',
      sectionName: 'Professional Summary',
      status: changeType,
      summaryText: changeType === 'added' ? 'Added in Version B' : changeType === 'removed' ? 'Removed in Version B' : 'Summary text modified',
      changes: [{ label: 'Summary', changeType, before: sumA || undefined, after: sumB || undefined }],
    });
  }

  // 3. Skills
  const skillChanges: FieldDiffItem[] = [];
  if (skillsAdded.length > 0) {
    skillChanges.push({ label: 'Added Skills', changeType: 'added', after: skillsAdded.join(', ') });
  }
  if (skillsRemoved.length > 0) {
    skillChanges.push({ label: 'Removed Skills', changeType: 'removed', before: skillsRemoved.join(', ') });
  }
  sectionDiffs.push({
    id: 'skills',
    sectionName: 'Skills & Technologies',
    status: skillChanges.length === 0 ? 'identical' : !listA.length && listB.length ? 'added' : listA.length && !listB.length ? 'removed' : 'modified',
    summaryText: skillChanges.length === 0 ? 'Identical skills list' : `+${skillsAdded.length} added, -${skillsRemoved.length} removed`,
    changes: skillChanges,
  });

  // 4. Experience
  const expA = Array.isArray(resumeA.experiences) ? resumeA.experiences : [];
  const expB = Array.isArray(resumeB.experiences) ? resumeB.experiences : [];
  const expChanges: FieldDiffItem[] = [];
  const maxExp = Math.max(expA.length, expB.length);
  for (let i = 0; i < maxExp; i++) {
    const a = expA[i];
    const b = expB[i];
    if (!a && b) {
      expChanges.push({ label: b.jobTitle || `Position #${i + 1}`, changeType: 'added', after: serializeExp(b) });
    } else if (a && !b) {
      expChanges.push({ label: a.jobTitle || `Position #${i + 1}`, changeType: 'removed', before: serializeExp(a) });
    } else if (a && b && serializeExp(a) !== serializeExp(b)) {
      expChanges.push({
        label: b.jobTitle || a.jobTitle || `Position #${i + 1}`,
        changeType: 'modified',
        before: serializeExp(a),
        after: serializeExp(b),
      });
    }
  }
  sectionDiffs.push({
    id: 'experience',
    sectionName: 'Work Experience',
    status: expChanges.length === 0 ? 'identical' : !expA.length && expB.length ? 'added' : expA.length && !expB.length ? 'removed' : 'modified',
    summaryText: expChanges.length === 0 ? 'Identical experience entries' : `${expChanges.length} entry difference(s)`,
    changes: expChanges,
  });

  // 5. Projects
  const projA = Array.isArray(resumeA.projects) ? resumeA.projects : [];
  const projB = Array.isArray(resumeB.projects) ? resumeB.projects : [];
  const projChanges: FieldDiffItem[] = [];
  const maxProj = Math.max(projA.length, projB.length);
  for (let i = 0; i < maxProj; i++) {
    const a = projA[i];
    const b = projB[i];
    if (!a && b) {
      projChanges.push({ label: b.title || `Project #${i + 1}`, changeType: 'added', after: serializeProj(b) });
    } else if (a && !b) {
      projChanges.push({ label: a.title || `Project #${i + 1}`, changeType: 'removed', before: serializeProj(a) });
    } else if (a && b && serializeProj(a) !== serializeProj(b)) {
      projChanges.push({
        label: b.title || a.title || `Project #${i + 1}`,
        changeType: 'modified',
        before: serializeProj(a),
        after: serializeProj(b),
      });
    }
  }
  sectionDiffs.push({
    id: 'projects',
    sectionName: 'Projects',
    status: projChanges.length === 0 ? 'identical' : !projA.length && projB.length ? 'added' : projA.length && !projB.length ? 'removed' : 'modified',
    summaryText: projChanges.length === 0 ? 'Identical projects' : `${projChanges.length} project difference(s)`,
    changes: projChanges,
  });

  // 6. Education
  const eduA = Array.isArray(resumeA.education) ? resumeA.education : [];
  const eduB = Array.isArray(resumeB.education) ? resumeB.education : [];
  const eduChanges: FieldDiffItem[] = [];
  const maxEdu = Math.max(eduA.length, eduB.length);
  for (let i = 0; i < maxEdu; i++) {
    const a = eduA[i];
    const b = eduB[i];
    if (!a && b) {
      eduChanges.push({ label: b.degree || `Education #${i + 1}`, changeType: 'added', after: serializeEdu(b) });
    } else if (a && !b) {
      eduChanges.push({ label: a.degree || `Education #${i + 1}`, changeType: 'removed', before: serializeEdu(a) });
    } else if (a && b && serializeEdu(a) !== serializeEdu(b)) {
      eduChanges.push({
        label: b.degree || a.degree || `Education #${i + 1}`,
        changeType: 'modified',
        before: serializeEdu(a),
        after: serializeEdu(b),
      });
    }
  }
  sectionDiffs.push({
    id: 'education',
    sectionName: 'Education',
    status: eduChanges.length === 0 ? 'identical' : !eduA.length && eduB.length ? 'added' : eduA.length && !eduB.length ? 'removed' : 'modified',
    summaryText: eduChanges.length === 0 ? 'Identical education entries' : `${eduChanges.length} education difference(s)`,
    changes: eduChanges,
  });

  // 7. Certifications & Achievements
  const certA = Array.isArray(resumeA.certifications) ? resumeA.certifications.map(serializeCert) : [];
  const certB = Array.isArray(resumeB.certifications) ? resumeB.certifications.map(serializeCert) : [];
  const achA = Array.isArray(resumeA.achievements) ? resumeA.achievements.map(normStr) : [];
  const achB = Array.isArray(resumeB.achievements) ? resumeB.achievements.map(normStr) : [];
  const extraChanges: FieldDiffItem[] = [];
  if (certA.join('||') !== certB.join('||')) {
    extraChanges.push({
      label: 'Certifications',
      changeType: !certA.length ? 'added' : !certB.length ? 'removed' : 'modified',
      before: certA.join('; ') || undefined,
      after: certB.join('; ') || undefined,
    });
  }
  if (achA.join('||') !== achB.join('||')) {
    extraChanges.push({
      label: 'Achievements',
      changeType: !achA.length ? 'added' : !achB.length ? 'removed' : 'modified',
      before: achA.join('; ') || undefined,
      after: achB.join('; ') || undefined,
    });
  }
  sectionDiffs.push({
    id: 'additional',
    sectionName: 'Certifications & Achievements',
    status: extraChanges.length === 0 ? 'identical' : 'modified',
    summaryText: extraChanges.length === 0 ? 'Identical certifications & achievements' : `${extraChanges.length} update(s)`,
    changes: extraChanges,
  });

  const totalSectionChanges = sectionDiffs.reduce((sum, s) => sum + s.changes.length, 0);
  const isIdentical = totalSectionChanges === 0;

  // Score breakdown comparison
  const breakdownA = (analysisA?.breakdown || {}) as Record<string, { score?: number; label?: string; feedback?: string } | undefined>;
  const breakdownB = (analysisB?.breakdown || {}) as Record<string, { score?: number; label?: string; feedback?: string } | undefined>;

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

  sectionsToCompare.forEach((key) => {
    const secA = breakdownA[key] || { score: 0, label: String(key), feedback: '' };
    const secB = breakdownB[key] || { score: 0, label: String(key), feedback: '' };
    const diff = (secB.score || 0) - (secA.score || 0);

    if (diff > 0) {
      improvedSections.push({ name: secB.label || String(key), diff, feedback: secB.feedback || '' });
    } else if (diff < 0) {
      weakerSections.push({ name: secB.label || String(key), diff, feedback: secB.feedback || '' });
    } else {
      unchangedSections.push({ name: secB.label || String(key), score: secB.score || 0 });
    }
  });

  return {
    isIdentical,
    totalSectionChanges,
    scoreA: analysisA?.score || 0,
    scoreB: analysisB?.score || 0,
    scoreDiff: (analysisB?.score || 0) - (analysisA?.score || 0),
    statusA: analysisA?.status || 'Good Match',
    statusB: analysisB?.status || 'Good Match',
    skillsAdded,
    skillsRemoved,
    skillsCommon,
    experienceCountA: expA.length,
    experienceCountB: expB.length,
    projectsCountA: projA.length,
    projectsCountB: projB.length,
    educationCountA: eduA.length,
    educationCountB: eduB.length,
    sectionDiffs,
    improvedSections,
    weakerSections,
    unchangedSections,
    analysisA,
    analysisB,
  };
}
