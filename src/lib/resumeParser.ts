import { ResumeData, Experience, Education, Project, Certification } from '@/types/resume';

export interface ParsedResumeResult {
  success: boolean;
  fileName: string;
  fileType: string;
  data: Partial<ResumeData>;
  extractedFields: string[];
  rawTextPreview: string;
  errorMessage?: string;
}

/**
 * Regex patterns for contact information
 */
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
const PORTFOLIO_REGEX = /(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:dev|io|me|com|tech))\b/i;

/**
 * Section header detection regexes
 */
const SECTION_HEADERS = {
  summary: /^(?:professional\s+)?summary|profile|about\s*(?:me)?|objective$/i,
  experience: /^(?:work\s+)?experience|employment(?:\s+history)?|work\s+history|professional\s+experience$/i,
  education: /^education|academic\s*(?:background|history)?|qualifications$/i,
  skills: /^(?:technical\s+)?skills|technologies|competencies|core\s+competencies|tools\s+&\s+technologies$/i,
  projects: /^(?:technical\s+|key\s+)?projects|notable\s+projects$/i,
  certifications: /^certifications|licenses(?:\s+&\s+certifications)?|credentials$/i,
  achievements: /^achievements|honors(?:\s+&\s+awards)?|awards$/i,
};

/**
 * Parses raw extracted text into structured ResumeData
 */
export function parseResumeText(rawText: string, fileName = 'resume'): ParsedResumeResult {
  if (!rawText || rawText.trim().length < 20) {
    return {
      success: false,
      fileName,
      fileType: 'text',
      data: {},
      extractedFields: [],
      rawTextPreview: rawText || '',
      errorMessage: 'The file contains insufficient readable text. Please ensure it is not an image-only scan.',
    };
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const extractedFields: string[] = [];
  const parsed: Partial<ResumeData> = {
    skills: [],
    technologies: [],
    experiences: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
  };

  // 1. Extract Contacts
  const emailMatch = rawText.match(EMAIL_REGEX);
  if (emailMatch) {
    parsed.email = emailMatch[0];
    extractedFields.push('Email');
  }

  const phoneMatch = rawText.match(PHONE_REGEX);
  if (phoneMatch) {
    parsed.phone = phoneMatch[0];
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

  const portfolioMatch = rawText.match(PORTFOLIO_REGEX);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    parsed.portfolio = portfolioMatch[0];
    extractedFields.push('Portfolio');
  }

  // 2. Candidate Name & Job Title heuristic (usually line 0 & 1 before contact block)
  if (lines.length > 0) {
    const candidateName = lines[0];
    if (candidateName.length <= 45 && !candidateName.includes('@') && !/http|www/i.test(candidateName)) {
      parsed.fullName = candidateName.replace(/[•|,-].*$/, '').trim();
      extractedFields.push('Full Name');
    }

    if (lines.length > 1 && lines[1].length <= 50 && !lines[1].includes('@') && !PHONE_REGEX.test(lines[1])) {
      parsed.jobTitle = lines[1];
      extractedFields.push('Job Title');
    }
  }

  // 3. Segment into Sections
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
    let detectedHeader: SectionKey | null = null;

    for (const [key, regex] of Object.entries(SECTION_HEADERS) as [SectionKey, RegExp][]) {
      if (regex.test(line.replace(/[:_-]/g, '').trim())) {
        detectedHeader = key;
        break;
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

  // 4. Parse Summary
  if (sectionContent.summary.length > 0) {
    parsed.summary = sectionContent.summary.slice(0, 5).join(' ');
    parsed.aboutMe = parsed.summary;
    extractedFields.push('Summary');
  }

  // 5. Parse Skills
  if (sectionContent.skills.length > 0) {
    const skillsText = sectionContent.skills.join(' ');
    const splitSkills = skillsText
      .split(/[,|•·\n;/]/)
      .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
      .filter((s) => s.length > 1 && s.length < 35 && !/skills|proficiencies|tools/i.test(s));

    if (splitSkills.length > 0) {
      parsed.skills = Array.from(new Set(splitSkills)).slice(0, 20);
      parsed.technologies = parsed.skills;
      extractedFields.push('Skills');
    }
  }

  // 6. Parse Experience
  if (sectionContent.experience.length > 0) {
    const expLines = sectionContent.experience;
    const experiences: Experience[] = [];
    let currentExp: Partial<Experience> | null = null;

    for (const line of expLines) {
      const isDateLine = /\b(19|20)\d{2}\b|present|current/i.test(line);
      const isBullet = /^[-•*]\s*/.test(line);

      if (isDateLine && !isBullet) {
        if (currentExp && (currentExp.jobTitle || currentExp.company)) {
          experiences.push({
            id: `exp-imp-${experiences.length + 1}`,
            jobTitle: currentExp.jobTitle || 'Software Engineer',
            company: currentExp.company || 'Technology Company',
            location: currentExp.location || 'Remote',
            startDate: currentExp.startDate || '2022',
            endDate: currentExp.endDate || 'Present',
            current: true,
            description: currentExp.description || '',
          });
        }
        currentExp = {
          jobTitle: line.split(/[-|–,]/)[0]?.trim() || 'Software Engineer',
          company: line.split(/[-|–,]/)[1]?.trim() || 'Company',
          startDate: '2022',
          endDate: 'Present',
          description: '',
        };
      } else if (currentExp) {
        currentExp.description = (currentExp.description ? currentExp.description + '\n' : '') + line;
      }
    }

    if (currentExp && (currentExp.jobTitle || currentExp.company)) {
      experiences.push({
        id: `exp-imp-${experiences.length + 1}`,
        jobTitle: currentExp.jobTitle || 'Software Engineer',
        company: currentExp.company || 'Technology Company',
        location: currentExp.location || 'Remote',
        startDate: currentExp.startDate || '2022',
        endDate: currentExp.endDate || 'Present',
        current: true,
        description: currentExp.description || '',
      });
    }

    if (experiences.length > 0) {
      parsed.experiences = experiences;
      extractedFields.push('Experience');
    }
  }

  // 7. Parse Education
  if (sectionContent.education.length > 0) {
    const eduLines = sectionContent.education;
    const educationList: Education[] = [];

    eduLines.forEach((line, idx) => {
      if (/degree|bachelor|master|b\.s|m\.s|b\.tech|m\.tech|phd|university|college|institute/i.test(line)) {
        educationList.push({
          id: `edu-imp-${idx + 1}`,
          degree: line.includes(',') ? line.split(',')[0].trim() : line,
          institution: line.includes(',') ? line.split(',')[1].trim() : 'University',
          location: 'USA',
          graduationDate: line.match(/\b(19|20)\d{2}\b/)?.[0] || '2023',
          description: 'Completed comprehensive coursework in computer science and software development.',
        });
      }
    });

    if (educationList.length > 0) {
      parsed.education = educationList;
      extractedFields.push('Education');
    }
  }

  // 8. Parse Certifications
  if (sectionContent.certifications.length > 0) {
    const certs: Certification[] = sectionContent.certifications
      .filter((l) => l.length > 3)
      .slice(0, 5)
      .map((line, idx) => ({
        id: `cert-imp-${idx + 1}`,
        name: line.replace(/^[-•*]\s*/, ''),
        issuer: 'Professional Issuer',
        date: '2023',
      }));

    if (certs.length > 0) {
      parsed.certifications = certs;
      extractedFields.push('Certifications');
    }
  }

  return {
    success: extractedFields.length > 0,
    fileName,
    fileType: 'text',
    data: parsed,
    extractedFields,
    rawTextPreview: lines.slice(0, 30).join('\n'),
  };
}

/**
 * Extracts raw text from client-side file upload
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // JSON File (Resume Craft Export or JSON Resume)
  if (extension === 'json') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read JSON file.'));
      reader.readAsText(file);
    });
  }

  // Plain Text / Markdown
  if (extension === 'txt' || extension === 'md') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // DOCX / Word Document text extraction in browser
  if (extension === 'docx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            // Basic XML text stripper for docx payload
            const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
            resolve(stripped);
          } else {
            // Binary array buffer fallback: convert ASCII characters
            const buffer = new Uint8Array(content as ArrayBuffer);
            let text = '';
            for (let i = 0; i < buffer.length; i++) {
              const code = buffer[i];
              if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
                text += String.fromCharCode(code);
              }
            }
            const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ');
            resolve(clean);
          }
        } catch {
          reject(new Error('Unable to extract text from this DOCX file. Please upload as PDF, TXT or JSON.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading DOCX file.'));
      reader.readAsArrayBuffer(file);
    });
  }

  // PDF Document: Extract readable text streams in browser
  if (extension === 'pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
          let text = '';
          // Extract text within PDF text operators: (text)Tj, [(t1)(t2)]TJ, /F1 ... Tf
          let inTextObj = false;

          for (let i = 0; i < buffer.length; i++) {
            const char = String.fromCharCode(buffer[i]);
            if (char === '(' && inTextObj) {
              // start of literal string in PDF
              let strContent = '';
              i++;
              while (i < buffer.length && String.fromCharCode(buffer[i]) !== ')') {
                strContent += String.fromCharCode(buffer[i]);
                i++;
              }
              text += strContent + ' ';
            } else if (char === 'B' && String.fromCharCode(buffer[i + 1]) === 'T') {
              inTextObj = true;
              i++;
            } else if (char === 'E' && String.fromCharCode(buffer[i + 1]) === 'T') {
              inTextObj = false;
              text += '\n';
              i++;
            }
          }

          // If PDF string extraction produced sufficient text, use it
          if (text.trim().length > 50) {
            resolve(text);
          } else {
            // Fallback: scan for readable printable ASCII blocks
            let asciiText = '';
            for (let i = 0; i < buffer.length; i++) {
              const code = buffer[i];
              if ((code >= 32 && code <= 126) || code === 10) {
                asciiText += String.fromCharCode(code);
              }
            }
            // Filter out PDF internal syntax keywords
            const filtered = asciiText
              .replace(/\/Filter|\/FlateDecode|\/Length\s+\d+|\/Type|\/Pages|\/Font/g, '')
              .replace(/stream[\s\S]*?endstream/g, '')
              .replace(/\s{2,}/g, ' ');

            if (filtered.trim().length > 30) {
              resolve(filtered);
            } else {
              reject(new Error('Could not parse text streams from this PDF. Please verify it contains selectable text, or try uploading in TXT / JSON format.'));
            }
          }
        } catch {
          reject(new Error('Failed to parse PDF in browser.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file.'));
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error(`Unsupported file format (.${extension}). Supported formats: PDF, DOCX, TXT, JSON.`);
}
