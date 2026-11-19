import { ResumeData, Experience, Education, Project, Certification } from '@/types/resume';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// @ts-expect-error mammoth browser bundle provides standard extractRawText({ arrayBuffer })
import mammoth from 'mammoth/mammoth.browser.min.js';

// Configure local Vite-bundled PDF.js worker (no external CDN dependency)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_IMPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'txt', 'json', 'md']);

export interface ParsedResumeResult {
  success: boolean;
  fileName: string;
  fileType: string;
  data: Partial<ResumeData>;
  extractedFields: string[];
  rawTextPreview: string;
  errorMessage?: string;
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
const WEBSITE_REGEX = /(?:https?:\/\/)(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s,)]*)?/gi;

const SECTION_HEADERS = {
  summary: /^(?:#+\s*)?(?:professional\s+summary|career\s+summary|executive\s+summary|summary|profile|about\s*(?:me)?|objective)$/i,
  experience: /^(?:#+\s*)?(?:work\s+experience|professional\s+experience|employment(?:\s+history)?|work\s+history|experience(?:\s*&\s*internships)?|internships)$/i,
  education: /^(?:#+\s*)?(?:education(?:\s*&\s*academic\s+credentials)?|academic\s*(?:background|history)?|qualifications)$/i,
  skills: /^(?:#+\s*)?(?:technical\s+skills(?:\s*&\s*[a-z\s]+)?|skills(?:\s*&\s*technologies)?|technologies|competencies|core\s+competencies|technical\s+stack(?:\s*&\s*tooling)?|tools\s*&\s*technologies)$/i,
  projects: /^(?:#+\s*)?(?:technical\s+projects|key\s+projects|featured\s+projects|open\s+source\s+projects(?:\s*&\s*packages)?|projects|notable\s+projects)$/i,
  certifications: /^(?:#+\s*)?(?:certifications(?:\s*&\s*credentials)?|licenses(?:\s*&\s*certifications)?|credentials)$/i,
  achievements: /^(?:#+\s*)?(?:achievements|honors(?:\s*&\s*(?:awards|achievements|recognition))?|awards)$/i,
};

function cleanHeaderCandidate(line: string): string {
  return line
    .replace(/^#+\s*/, '')
    .replace(/[*_`]/g, '')
    .replace(/[:_-]+$/, '')
    .trim();
}

function extractLocationHeuristic(topLines: string[]): string {
  const joined = topLines.slice(0, 6).join(' | ');
  // City, ST or City, Country
  const cityState = joined.match(/\b([A-Z][a-zA-Z.\s]{2,22},\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]{2,15}|India|USA|UK|Canada|Remote))\b/);
  if (cityState) return cityState[1].trim();
  return '';
}

/**
 * Parses raw extracted text into structured ResumeData cleanly WITHOUT inventing fake fallback fields.
 */
export function parseResumeText(rawText: string, fileName = 'resume'): ParsedResumeResult {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'text';

  if (!rawText || rawText.trim().length < 20) {
    return {
      success: false,
      fileName,
      fileType: extension,
      data: {},
      extractedFields: [],
      rawTextPreview: rawText || '',
      errorMessage: 'The uploaded file contains insufficient readable text (it may be empty or an image-only scan).',
    };
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const extractedFields: string[] = [];
  const parsed: Partial<ResumeData> = {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    aboutMe: '',
    skills: [],
    technologies: [],
    experiences: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
  };

  // 1. Contacts
  const emailMatch = rawText.match(EMAIL_REGEX);
  if (emailMatch) {
    parsed.email = emailMatch[0];
    extractedFields.push('Email');
  }

  const phoneMatch = rawText.match(PHONE_REGEX);
  if (phoneMatch) {
    parsed.phone = phoneMatch[0].trim();
    extractedFields.push('Phone');
  }

  const linkedinMatch = rawText.match(LINKEDIN_REGEX);
  if (linkedinMatch) {
    parsed.linkedin = linkedinMatch[0];
    extractedFields.push('LinkedIn');
  }

  const githubMatch = rawText.match(GITHUB_REGEX);
  if (githubMatch) {
    parsed.github = githubMatch[0];
    extractedFields.push('GitHub');
  }

  const urlMatches = rawText.match(WEBSITE_REGEX) || [];
  const portfolioUrl = urlMatches.find(
    (u) => !/linkedin\.com|github\.com|mailto:|tel:/i.test(u)
  );
  if (portfolioUrl) {
    parsed.portfolio = portfolioUrl;
    extractedFields.push('Portfolio');
  }

  const detectedLocation = extractLocationHeuristic(lines);
  if (detectedLocation) {
    parsed.location = detectedLocation;
    extractedFields.push('Location');
  }

  // 2. Name & Job Title from top lines before first section header
  let firstSectionIdx = lines.length;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const cleaned = cleanHeaderCandidate(lines[i]);
    const isSec = Object.values(SECTION_HEADERS).some((re) => re.test(cleaned));
    if (isSec) {
      firstSectionIdx = i;
      break;
    }
  }

  const headerLines = lines.slice(0, Math.max(1, firstSectionIdx));
  for (const line of headerLines) {
    const stripped = line.replace(/^#+\s*/, '').replace(/[*_`]/g, '').trim();
    if (!stripped) continue;

    // Skip lines that are primarily contact strings
    const hasContact = EMAIL_REGEX.test(stripped) || PHONE_REGEX.test(stripped) || /linkedin\.com|github\.com|http/i.test(stripped);
    if (!parsed.fullName && !hasContact && stripped.length >= 2 && stripped.length <= 50) {
      // Name usually contains 1-4 words and no digits
      if (!/\d/.test(stripped)) {
        parsed.fullName = stripped.split(/[|•]/)[0].trim();
        if (parsed.fullName) extractedFields.push('Full Name');
        continue;
      }
    }

    if (parsed.fullName && !parsed.jobTitle && !hasContact && stripped.length >= 3 && stripped.length <= 65) {
      parsed.jobTitle = stripped;
      extractedFields.push('Job Title');
      break;
    }
  }

  // 3. Segment sections
  type SectionKey = keyof typeof SECTION_HEADERS;
  let currentSection: SectionKey | null = null;
  const sectionContent: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleaned = cleanHeaderCandidate(line);
    let detectedHeader: SectionKey | null = null;

    if (cleaned.length <= 60) {
      for (const [key, regex] of Object.entries(SECTION_HEADERS) as [SectionKey, RegExp][]) {
        if (regex.test(cleaned)) {
          detectedHeader = key;
          break;
        }
      }
    }

    if (detectedHeader) {
      currentSection = detectedHeader;
      continue;
    }

    if (currentSection) {
      sectionContent[currentSection].push(line);
    }
  }

  // 4. Summary
  if (sectionContent.summary.length > 0) {
    parsed.summary = sectionContent.summary.join(' ').replace(/\s+/g, ' ').trim();
    parsed.aboutMe = parsed.summary;
    extractedFields.push('Summary');
  }

  // 5. Skills
  if (sectionContent.skills.length > 0) {
    const rawSkillLines = sectionContent.skills
      .map((l) => l.replace(/^[a-zA-Z\s&/]+:\s*/, ''))
      .join(', ');
    const splitSkills = rawSkillLines
      .split(/[,|•·\n;/]+/)
      .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
      .filter((s) => s.length >= 1 && s.length <= 40);

    const seen = new Set<string>();
    const uniqueSkills: string[] = [];
    for (const s of splitSkills) {
      const k = s.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        uniqueSkills.push(s);
      }
    }

    if (uniqueSkills.length > 0) {
      parsed.skills = uniqueSkills.slice(0, 30);
      parsed.technologies = parsed.skills;
      extractedFields.push('Skills');
    }
  }

  // 6. Experience (No fabricated fallbacks!)
  if (sectionContent.experience.length > 0) {
    const expLines = sectionContent.experience;
    const experiences: Experience[] = [];
    let currentExp: Experience | null = null;

    const datePattern = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|(?:19|20)\d{2})\s*(?:[-–—to]+)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|(?:19|20)\d{2}|Present|Current)\b/i;

    for (const line of expLines) {
      const isBullet = /^[-•*]\s+/.test(line);
      const dateMatch = line.match(datePattern);

      if (!isBullet && dateMatch) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        const beforeDate = line.replace(dateMatch[0], '').replace(/[|•(),]+$/g, '').trim();
        const parts = beforeDate.split(/\s*(?:\||—|–| - | at | @ )\s*/i).filter(Boolean);
        currentExp = {
          id: `exp-imp-${experiences.length + 1}`,
          jobTitle: parts[0] || beforeDate || '',
          company: parts[1] || '',
          location: parts[2] || '',
          startDate: dateMatch[1] || '',
          endDate: dateMatch[2] || '',
          current: /present|current/i.test(dateMatch[2] || ''),
          description: '',
        };
      } else if (!isBullet && currentExp && !currentExp.company && line.length < 70 && !/[.!?]$/.test(line)) {
        currentExp.company = line.split(/[|•]/)[0].trim();
      } else if (currentExp) {
        currentExp.description = currentExp.description
          ? `${currentExp.description}\n${line}`
          : line;
      } else {
        // Entry without explicit date line at top
        const parts = line.split(/\s*(?:\||—|–| at | @ )\s*/i).filter(Boolean);
        currentExp = {
          id: `exp-imp-${experiences.length + 1}`,
          jobTitle: parts[0] || line,
          company: parts[1] || '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        };
      }
    }

    if (currentExp) {
      experiences.push(currentExp);
    }

    if (experiences.length > 0) {
      parsed.experiences = experiences;
      extractedFields.push('Experience');
    }
  }

  // 7. Projects
  if (sectionContent.projects.length > 0) {
    const projLines = sectionContent.projects;
    const projects: Project[] = [];
    let currentProj: Project | null = null;

    for (const line of projLines) {
      const isBullet = /^[-•*]\s+/.test(line);
      if (!isBullet && line.length < 95 && !/[.!?]$/.test(line)) {
        if (currentProj) {
          projects.push(currentProj);
        }
        const parts = line.split(/\s*(?:\||—|–)\s*/).filter(Boolean);
        currentProj = {
          id: `proj-imp-${projects.length + 1}`,
          title: parts[0] || line,
          technologies: parts[1] || '',
          startDate: '',
          endDate: '',
          description: '',
          link: line.match(/github\.com\/[^\s]+/i)?.[0] || '',
        };
      } else if (currentProj) {
        currentProj.description = currentProj.description
          ? `${currentProj.description}\n${line}`
          : line;
      }
    }
    if (currentProj) {
      projects.push(currentProj);
    }
    if (projects.length > 0) {
      parsed.projects = projects;
      extractedFields.push('Projects');
    }
  }

  // 8. Education (No fabricated USA/2023 placeholders!)
  if (sectionContent.education.length > 0) {
    const eduLines = sectionContent.education;
    const educationList: Education[] = [];
    let currentEdu: Education | null = null;

    for (const line of eduLines) {
      const yearMatch = line.match(/\b((?:19|20)\d{2}(?:\s*[-–—]\s*(?:(?:19|20)\d{2}|Present))?)\b/i);
      const looksLikeDegreeOrSchool = /degree|bachelor|master|b\.?s\.?|m\.?s\.?|b\.?tech|m\.?tech|b\.?e\.?|ph\.?d|university|college|institute|school/i.test(line);

      if (looksLikeDegreeOrSchool) {
        const cleaned = line.replace(yearMatch ? yearMatch[0] : '', '').replace(/[|•(),]+$/g, '').trim();
        const parts = cleaned.split(/\s*(?:\||—|–|,)\s*/).filter(Boolean);
        if (currentEdu && !currentEdu.institution && parts.length === 1 && /university|college|institute|school/i.test(cleaned)) {
          currentEdu.institution = cleaned;
          if (!currentEdu.graduationDate && yearMatch) currentEdu.graduationDate = yearMatch[1];
        } else if (currentEdu && !currentEdu.degree && parts.length === 1 && /bachelor|master|b\.?s|m\.?s|b\.?tech|m\.?tech|ph\.?d|degree/i.test(cleaned)) {
          currentEdu.degree = cleaned;
          if (!currentEdu.graduationDate && yearMatch) currentEdu.graduationDate = yearMatch[1];
        } else {
          if (currentEdu) educationList.push(currentEdu);
          currentEdu = {
            id: `edu-imp-${educationList.length + 1}`,
            degree: parts[0] || cleaned,
            institution: parts[1] || '',
            location: '',
            graduationDate: yearMatch ? yearMatch[1] : '',
            description: '',
          };
        }
      } else if (currentEdu) {
        const gpaMatch = line.match(/gpa[:\s]*([0-9.]+\s*(?:\/\s*[0-9.]+)?)/i);
        if (gpaMatch) {
          currentEdu.gpa = gpaMatch[1].trim();
        } else if (/coursework/i.test(line)) {
          currentEdu.coursework = line.replace(/^.*coursework[:\s]*/i, '').trim();
        } else {
          currentEdu.description = currentEdu.description ? `${currentEdu.description} ${line}` : line;
        }
      }
    }

    if (currentEdu) {
      educationList.push(currentEdu);
    }

    if (educationList.length > 0) {
      parsed.education = educationList;
      extractedFields.push('Education');
    }
  }

  // 9. Certifications & Achievements
  if (sectionContent.certifications.length > 0) {
    const certs: Certification[] = sectionContent.certifications
      .filter((l) => l.length > 2)
      .slice(0, 10)
      .map((line, idx) => {
        const clean = line.replace(/^[-•*]\s*/, '');
        const parts = clean.split(/\s*(?:—|–|-|\|)\s*/);
        return {
          id: `cert-imp-${idx + 1}`,
          name: parts[0] || clean,
          issuer: parts[1] || '',
          date: clean.match(/\b(19|20)\d{2}\b/)?.[0] || '',
        };
      });

    if (certs.length > 0) {
      parsed.certifications = certs;
      extractedFields.push('Certifications');
    }
  }

  if (sectionContent.achievements.length > 0) {
    const achs = sectionContent.achievements
      .map((l) => l.replace(/^[-•*]\s*/, '').trim())
      .filter((l) => l.length > 3);
    if (achs.length > 0) {
      parsed.achievements = achs;
      extractedFields.push('Achievements');
    }
  }

  return {
    success: extractedFields.length > 0,
    fileName,
    fileType: extension,
    data: parsed,
    extractedFields,
    rawTextPreview: lines.slice(0, 30).join('\n'),
    errorMessage: extractedFields.length === 0 ? 'Could not identify standard resume fields in this document.' : undefined,
  };
}

/**
 * Validates and extracts readable text from client-side files (PDF, DOCX, TXT, MD, JSON).
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file selected.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error(`Unsupported file format (.${extension || 'unknown'}). Please upload a PDF, DOCX, TXT, JSON, or Markdown file.`);
  }

  if (file.size === 0) {
    throw new Error('The uploaded file is empty (0 bytes). Please choose a valid resume file.');
  }

  if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
    throw new Error('File exceeds the 10 MB size limit. Please upload a smaller resume document.');
  }

  if (extension === 'json' || extension === 'txt' || extension === 'md') {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error('The uploaded text file contains no readable content.');
    }
    return text;
  }

  if (extension === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = (result?.value || '').trim();
      if (text.length < 15) {
        throw new Error('No readable text could be extracted from this DOCX file.');
      }
      return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('readable text')) throw err;
      throw new Error('Could not parse this DOCX file. Please ensure it is a valid .docx document and not password-protected or corrupted.');
    }
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      const pageTexts: string[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        // Preserve line breaks cleanly using y-coordinate grouping
        const linesByY: Array<{ y: number; items: Array<{ x: number; str: string }> }> = [];
        for (const rawItem of content.items) {
          if (!('str' in rawItem)) continue;
          const str = rawItem.str;
          if (!str) continue;
          const x = Array.isArray(rawItem.transform) ? Number(rawItem.transform[4]) || 0 : 0;
          const y = Array.isArray(rawItem.transform) ? Number(rawItem.transform[5]) || 0 : 0;

          let bucket = linesByY.find((b) => Math.abs(b.y - y) < 3.5);
          if (!bucket) {
            bucket = { y, items: [] };
            linesByY.push(bucket);
          }
          bucket.items.push({ x, str });
        }

        linesByY.sort((a, b) => b.y - a.y);
        const lines = linesByY
          .map((b) =>
            b.items
              .sort((i1, i2) => i1.x - i2.x)
              .map((i) => i.str)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim()
          )
          .filter(Boolean);

        pageTexts.push(lines.join('\n'));
      }

      const fullText = pageTexts.join('\n').trim();
      if (fullText.length < 20) {
        throw new Error('Could not extract selectable text from this PDF. It may be an image-only scan.');
      }
      return fullText;
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('selectable text')) throw err;
      throw new Error('Failed to parse PDF document in browser. Please ensure the PDF is not corrupted or encrypted.');
    }
  }

  throw new Error(`Unsupported file format (.${extension}).`);
}
