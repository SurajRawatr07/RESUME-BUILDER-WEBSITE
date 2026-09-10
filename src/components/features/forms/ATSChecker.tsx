import { useState, useMemo } from "react";
import { X, FileText, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResumeData } from "@/types/resume";

interface ATSCheckerProps {
  resumeData: ResumeData;
  onClose: () => void;
}

/* =========================================================
   DOMAIN SKILL MAP (IMPORTANT FIX)
========================================================= */

const FRONTEND_SKILLS = [
  "react","vue","angular","html","css","javascript","typescript",
  "tailwind","redux","next","frontend","ui","ux","dom"
];

const BACKEND_SKILLS = [
  "node","express","django","flask","spring","java","python",
  "api","database","sql","mongodb","microservices","server",
  "backend","authentication","rest"
];

const DEVOPS_SKILLS = [
  "docker","kubernetes","aws","gcp","ci","cd","pipeline",
  "linux","deployment","jenkins"
];

function detectDomain(text: string) {
  const t = text.toLowerCase();

  let fe = 0, be = 0, devops = 0;

  FRONTEND_SKILLS.forEach(s => { if (t.includes(s)) fe++; });
  BACKEND_SKILLS.forEach(s => { if (t.includes(s)) be++; });
  DEVOPS_SKILLS.forEach(s => { if (t.includes(s)) devops++; });

  if (fe >= be && fe >= devops) return "frontend";
  if (be >= fe && be >= devops) return "backend";
  return "devops";
}

/* =========================================================
   TOKENIZER
========================================================= */

function tokenize(text: string) {
  return text.toLowerCase().split(/\W+/).filter(Boolean);
}

/* =========================================================
   DOMAIN MISMATCH PENALTY ENGINE (MAIN FIX)
========================================================= */

function domainPenalty(resumeDomain: string, jobDomain: string) {
  if (resumeDomain === jobDomain) return 0;

  // harsh penalty if mismatch
  if (
    (resumeDomain === "frontend" && jobDomain === "backend") ||
    (resumeDomain === "backend" && jobDomain === "frontend")
  ) {
    return 35; // BIG REALISTIC PENALTY
  }

  return 15;
}

/* =========================================================
   KEYWORD MATCH (IMPROVED - NOT BINARY ANYMORE)
========================================================= */

function keywordMatch(resume: string, jd: string) {
  const rTokens = tokenize(resume);
  const jTokens = tokenize(jd);

  const rSet = new Set(rTokens);

  let match = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  jTokens.forEach(k => {
    if (k.length < 3) return;

    if (rSet.has(k)) {
      match += 1;
      matched.push(k);
    } else {
      missing.push(k);
    }
  });

  const score = jTokens.length
    ? (match / jTokens.length) * 100
    : 0;

  return {
    score,
    matched,
    missing: [...new Set(missing)]
  };
}

/* =========================================================
   STRUCTURE SCORE
========================================================= */

function structureScore(resume: ResumeData) {
  let score = 0;

  if (resume.summary) score += 20;
  if (resume.experiences.length > 0) score += 25;
  if (resume.education.length > 0) score += 15;
  if (resume.skills.length > 3) score += 20;
  if (resume.technologies.length > 3) score += 20;

  return score;
}

/* =========================================================
   EXPERIENCE DEPTH
========================================================= */

function experienceScore(resume: ResumeData) {
  let score = 0;

  resume.experiences.forEach(exp => {
    if (exp.description.length > 120) score += 15;
    else if (exp.description.length > 60) score += 10;
    else score += 5;

    if (exp.startDate && (exp.endDate || exp.current)) {
      score += 5;
    }
  });

  return Math.min(score, 100);
}

/* =========================================================
   FINAL ATS ENGINE (REALISTIC)
========================================================= */

function calculateATS(resume: ResumeData, jd: string) {
  const resumeText = `
    ${resume.jobTitle}
    ${resume.summary}
    ${resume.skills.join(" ")}
    ${resume.technologies.join(" ")}
    ${resume.experiences.map(e => e.description).join(" ")}
  `;

  const jobDomain = detectDomain(jd);
  const resumeDomain = detectDomain(resumeText);

  const structure = structureScore(resume);
  const experience = experienceScore(resume);

  const keyword = keywordMatch(resumeText, jd);

  /* DOMAIN MISMATCH (CRITICAL FIX) */
  const mismatchPenalty = domainPenalty(resumeDomain, jobDomain);

  /* WEIGHTED SCORE SYSTEM */
  let total =
    structure * 0.25 +
    experience * 0.25 +
    keyword.score * 0.35 +
    20; // base quality

  /* APPLY PENALTY */
  total -= mismatchPenalty;

  /* HARD CAP (IMPORTANT FIX) */
  if (mismatchPenalty > 25) {
    total = Math.min(total, 55); // cannot go high for wrong domain
  }

  total = Math.max(0, Math.min(100, total));

  const warnings: string[] = [];

  if (mismatchPenalty > 25) {
    warnings.push(
      `Major domain mismatch: Resume (${resumeDomain}) vs Job (${jobDomain})`
    );
  }

  if (keyword.score < 30) {
    warnings.push("Very low keyword relevance for this job role");
  }

  return {
    total: Math.round(total),
    domain: { resumeDomain, jobDomain },
    keyword,
    structure,
    experience,
    mismatchPenalty,
    warnings,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ATSChecker({
  resumeData,
  onClose,
}: ATSCheckerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => {
    if (!analyzed) return null;
    return calculateATS(resumeData, jobDescription);
  }, [analyzed, jobDescription, resumeData]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full max-w-3xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

        {/* HEADER */}
        <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <FileText />
            <div>
              <h2 className="font-bold text-lg">
                ATS ANALYZER
              </h2>
              <p className="text-xs opacity-80">
                Domain-aware scoring engine
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">

          <Label className="text-gray-700 dark:text-gray-300">Job Description</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px] mt-1.5"
            placeholder="Paste job description here to analyze ATS compatibility..."
          />

          <Button
            className="w-full mt-4"
            onClick={() => setAnalyzed(true)}
          >
            Analyze
          </Button>

          {/* RESULT */}
          {result && (
            <div className="mt-6 space-y-4">

              <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">
                  ATS Score: {result.total}/100
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Resume: {result.domain.resumeDomain} → Job:{" "}
                  {result.domain.jobDomain}
                </p>
              </div>

              {/* WARNINGS */}
              {result.warnings.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl space-y-1 text-sm">
                  {result.warnings.map((w, i) => (
                    <div key={i}>⚠ {w}</div>
                  ))}
                </div>
              )}

              {/* KEYWORDS */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 rounded-xl">
                <h4 className="font-bold text-sm">
                  Keyword Match: {result.keyword.score.toFixed(1)}%
                </h4>
                <p className="text-xs mt-1">
                  Matched: {result.keyword.matched.slice(0, 10).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-right bg-gray-50/50 dark:bg-gray-900/50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}