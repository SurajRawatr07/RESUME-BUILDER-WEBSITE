import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { ResumeData, TemplateType, normalizeTemplateId } from "@/types/resume";
import {
  categorizeSkills,
  formatContactLabel,
  getContactHref,
  parseBullets,
} from "@/components/templates/templateUtils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates an ATS-friendly, selectable-text vector A4 PDF using jsPDF ("times" font),
 * with clean margins, clickable hyperlinks (mailto:, tel:, https://), wrapped text,
 * section heading orphan protection, and zero trailing blank pages.
 */
export const exportToPDF = async (
  resumeOrId: ResumeData | string,
  fileName: string,
  templateId?: TemplateType
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 15;
  const topMargin = 14;
  const bottomMargin = 14;
  const contentWidth = pageWidth - marginX * 2; // 180mm
  const maxY = pageHeight - bottomMargin; // 283mm
  let y = topMargin;

  // Fallback text export if called with a DOM element ID string
  if (typeof resumeOrId === "string") {
    const element =
      document.getElementById(resumeOrId) ||
      document.getElementById("resume-preview-content") ||
      document.querySelector(".resume-preview");
    const rawText = (element as HTMLElement | null)?.innerText?.trim() || "";
    if (!rawText) return;

    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const paragraphs = rawText.split(/\n+/);
    paragraphs.forEach((para) => {
      const wrapped = pdf.splitTextToSize(para.trim(), contentWidth) as string[];
      wrapped.forEach((line) => {
        if (y + 4.8 > maxY) {
          pdf.addPage();
          y = topMargin;
        }
        pdf.text(line, marginX, y);
        y += 4.6;
      });
      y += 1.2;
    });

    pdf.save(`${fileName}.pdf`);
    return;
  }

  const resume = resumeOrId;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > maxY) {
      pdf.addPage();
      y = topMargin;
    }
  };

  const drawWrappedLines = (
    lines: string[],
    x: number,
    lineHeightMm: number,
    fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal",
    fontSizePt = 9.5,
    color: [number, number, number] = [25, 25, 25]
  ) => {
    pdf.setFont("times", fontStyle);
    pdf.setFontSize(fontSizePt);
    pdf.setTextColor(color[0], color[1], color[2]);
    lines.forEach((line) => {
      ensureSpace(lineHeightMm);
      pdf.text(line, x, y);
      y += lineHeightMm;
    });
  };

  const drawSectionHeading = (title: string) => {
    // Keep heading attached to at least ~16mm of content below it
    ensureSpace(16);
    y += 1.2;
    pdf.setFont("times", "bold");
    pdf.setFontSize(10.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title.toUpperCase(), marginX, y);
    y += 1.5;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.35);
    pdf.line(marginX, y, pageWidth - marginX, y);
    y += 4.0;
  };

  // ── 1. HEADER: Left Name + Role, Right / Wrapped Clickable Contact Links ──
  interface ContactToken {
    label: string;
    url?: string;
  }

  const contactTokens: ContactToken[] = [];
  if (resume.location?.trim()) {
    contactTokens.push({ label: resume.location.trim() });
  }
  if (resume.phone?.trim()) {
    contactTokens.push({
      label: formatContactLabel("phone", resume.phone),
      url: getContactHref("phone", resume.phone),
    });
  }
  if (resume.email?.trim()) {
    contactTokens.push({
      label: formatContactLabel("email", resume.email),
      url: getContactHref("email", resume.email),
    });
  }
  if (resume.linkedin?.trim()) {
    contactTokens.push({
      label: formatContactLabel("linkedin", resume.linkedin),
      url: getContactHref("linkedin", resume.linkedin),
    });
  }
  if (resume.github?.trim()) {
    contactTokens.push({
      label: formatContactLabel("github", resume.github),
      url: getContactHref("github", resume.github),
    });
  }
  const activePortfolio = resume.portfolio?.trim() || resume.website?.trim();
  if (activePortfolio) {
    contactTokens.push({
      label: formatContactLabel("portfolio", activePortfolio),
      url: getContactHref("portfolio", activePortfolio),
    });
  }
  if (resume.leetcode?.trim()) {
    contactTokens.push({
      label: formatContactLabel("leetcode", resume.leetcode),
      url: getContactHref("leetcode", resume.leetcode),
    });
  }

  const fullNameText = (resume.fullName || "Your Name").trim().toUpperCase();
  const jobTitleText = (resume.jobTitle || "").trim();

  // Left block width: up to 96mm; Right contact block width: 80mm
  const leftMaxWidth = 96;
  const rightMaxWidth = 80;

  pdf.setFont("times", "bold");
  pdf.setFontSize(18);
  const nameLines = pdf.splitTextToSize(fullNameText, leftMaxWidth) as string[];

  pdf.setFont("times", "italic");
  pdf.setFontSize(10.5);
  const titleLines = jobTitleText
    ? (pdf.splitTextToSize(jobTitleText, leftMaxWidth) as string[])
    : [];

  // Pack right contact tokens into right-aligned lines <= rightMaxWidth
  pdf.setFont("times", "normal");
  pdf.setFontSize(8.5);
  const sep = " | ";
  const sepWidth = pdf.getTextWidth(sep);

  const contactRows: ContactToken[][] = [];
  let currentRow: ContactToken[] = [];
  let currentRowWidth = 0;

  contactTokens.forEach((tok) => {
    const tokWidth = pdf.getTextWidth(tok.label);
    const needed = currentRow.length === 0 ? tokWidth : sepWidth + tokWidth;
    if (currentRow.length > 0 && currentRowWidth + needed > rightMaxWidth) {
      contactRows.push(currentRow);
      currentRow = [tok];
      currentRowWidth = tokWidth;
    } else {
      currentRow.push(tok);
      currentRowWidth += needed;
    }
  });
  if (currentRow.length > 0) contactRows.push(currentRow);

  // Render Left Name & Title
  let leftY = y + 3.5;
  pdf.setFont("times", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  nameLines.forEach((line) => {
    pdf.text(line, marginX, leftY);
    leftY += 6.2;
  });
  if (titleLines.length > 0) {
    pdf.setFont("times", "italic");
    pdf.setFontSize(10.5);
    pdf.setTextColor(40, 40, 40);
    titleLines.forEach((line) => {
      pdf.text(line, marginX, leftY);
      leftY += 4.3;
    });
  }

  // Render Right Contact Rows (right-aligned to pageWidth - marginX, with clickable URLs)
  let rightY = y + 2.5;
  pdf.setFont("times", "normal");
  pdf.setFontSize(8.5);
  contactRows.forEach((row) => {
    const totalRowWidth = row.reduce(
      (sum, tok, idx) =>
        sum + pdf.getTextWidth(tok.label) + (idx > 0 ? sepWidth : 0),
      0
    );
    let cursorX = pageWidth - marginX - totalRowWidth;
    row.forEach((tok, idx) => {
      if (idx > 0) {
        pdf.setTextColor(90, 90, 90);
        pdf.text(sep, cursorX, rightY);
        cursorX += sepWidth;
      }
      pdf.setTextColor(25, 25, 25);
      if (tok.url) {
        pdf.textWithLink(tok.label, cursorX, rightY, { url: tok.url });
      } else {
        pdf.text(tok.label, cursorX, rightY);
      }
      cursorX += pdf.getTextWidth(tok.label);
    });
    rightY += 3.9;
  });

  y = Math.max(leftY, rightY) + 1.0;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.6);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 4.5;

  // ── 2. SECTION RENDERERS ──
  const renderSummary = () => {
    const summaryText = (resume.summary || resume.aboutMe || "").trim();
    if (!summaryText) return;
    drawSectionHeading("Professional Summary");
    pdf.setFont("times", "normal");
    pdf.setFontSize(9.5);
    const lines = pdf.splitTextToSize(summaryText, contentWidth) as string[];
    drawWrappedLines(lines, marginX, 4.1, "normal", 9.5, [20, 20, 20]);
    y += 1.5;
  };

  const renderSkills = () => {
    const cat = categorizeSkills(resume);
    const rows: { label: string; values: string[] }[] = [
      { label: "Languages", values: cat.languages },
      { label: "Frontend & UI", values: cat.frontend },
      { label: "Backend & APIs", values: cat.backend },
      { label: "Databases & Storage", values: cat.databases },
      { label: "Developer Tools & Cloud", values: cat.tools },
      { label: "Core CS & Fundamentals", values: cat.coreCS },
      { label: "AI & ML", values: cat.ai },
      { label: "Additional Skills", values: cat.other },
    ].filter((r) => r.values.length > 0);

    if (rows.length === 0) return;

    drawSectionHeading("Technical Skills");
    rows.forEach((row) => {
      const prefix = `${row.label}: `;
      pdf.setFont("times", "bold");
      pdf.setFontSize(9.2);
      const prefixWidth = pdf.getTextWidth(prefix);

      pdf.setFont("times", "normal");
      pdf.setFontSize(9.2);
      const fullLine = `${prefix}${row.values.join(", ")}`;
      const wrapped = pdf.splitTextToSize(fullLine, contentWidth) as string[];

      wrapped.forEach((line, idx) => {
        ensureSpace(4.1);
        if (idx === 0) {
          pdf.setFont("times", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text(prefix, marginX, y);
          const rest = line.slice(prefix.length);
          pdf.setFont("times", "normal");
          pdf.setTextColor(25, 25, 25);
          pdf.text(rest, marginX + prefixWidth, y);
        } else {
          pdf.setFont("times", "normal");
          pdf.setTextColor(25, 25, 25);
          pdf.text(line, marginX, y);
        }
        y += 4.1;
      });
    });
    y += 1.5;
  };

  const renderBullets = (description?: string) => {
    if (!description?.trim()) return;
    const bullets = parseBullets(description);
    if (bullets.length === 0) return;

    const bulletCharX = marginX + 2.5;
    const bulletTextX = marginX + 5.8;
    const bulletWidth = contentWidth - 5.8;

    pdf.setFont("times", "normal");
    pdf.setFontSize(9.2);
    pdf.setTextColor(25, 25, 25);

    bullets.forEach((b) => {
      const wrapped = pdf.splitTextToSize(b, bulletWidth) as string[];
      wrapped.forEach((line, idx) => {
        ensureSpace(4.0);
        if (idx === 0) {
          pdf.text("•", bulletCharX, y);
        }
        pdf.text(line, bulletTextX, y);
        y += 4.0;
      });
    });
  };

  const renderExperience = () => {
    if (!resume.experiences?.length) return;
    drawSectionHeading("Professional Experience");

    resume.experiences.forEach((exp) => {
      ensureSpace(14);
      const company = (exp.company || "").trim();
      const location = (exp.location || "").trim();
      const role = (
        exp.jobTitle ||
        (exp as unknown as { title?: string }).title ||
        ""
      ).trim();
      const dateStr = `${exp.startDate || ""}${
        exp.startDate || exp.endDate || exp.current ? " – " : ""
      }${exp.current ? "Present" : exp.endDate || ""}`.trim();

      // Row 1: Company (bold left) + Location (normal right)
      pdf.setFont("times", "bold");
      pdf.setFontSize(9.8);
      pdf.setTextColor(0, 0, 0);
      const locWidth = location ? pdf.getTextWidth(location) + 4 : 0;
      const compLines = pdf.splitTextToSize(
        company || role || "Experience",
        contentWidth - locWidth
      ) as string[];
      compLines.forEach((line, idx) => {
        ensureSpace(4.2);
        pdf.setFont("times", "bold");
        pdf.setFontSize(9.8);
        pdf.setTextColor(0, 0, 0);
        pdf.text(line, marginX, y);
        if (idx === 0 && location) {
          pdf.setFont("times", "normal");
          pdf.setFontSize(8.8);
          pdf.setTextColor(65, 65, 65);
          pdf.text(location, pageWidth - marginX, y, { align: "right" });
        }
        y += 4.1;
      });

      // Row 2: Role (italic left) + Dates (italic right)
      if (role || dateStr) {
        pdf.setFont("times", "italic");
        pdf.setFontSize(9.2);
        const dateWidth = dateStr ? pdf.getTextWidth(dateStr) + 4 : 0;
        const roleLines = role
          ? (pdf.splitTextToSize(role, contentWidth - dateWidth) as string[])
          : [""];
        roleLines.forEach((line, idx) => {
          ensureSpace(4.0);
          if (line) {
            pdf.setFont("times", "italic");
            pdf.setFontSize(9.2);
            pdf.setTextColor(30, 30, 30);
            pdf.text(line, marginX, y);
          }
          if (idx === 0 && dateStr) {
            pdf.setFont("times", "italic");
            pdf.setFontSize(8.8);
            pdf.setTextColor(65, 65, 65);
            pdf.text(dateStr, pageWidth - marginX, y, { align: "right" });
          }
          y += 4.0;
        });
      }

      renderBullets(exp.description);
      y += 2.0;
    });
  };

  const renderProjects = () => {
    if (!resume.projects?.length) return;
    drawSectionHeading("Key Projects");

    resume.projects.forEach((proj) => {
      ensureSpace(12);
      const title = (proj.title || "").trim();
      const tech = Array.isArray(proj.technologies)
        ? (proj.technologies as string[]).join(", ")
        : (proj.technologies || "").trim();
      const headerLeft = tech ? `${title} (${tech})` : title;
      const linkLabel = proj.link ? formatContactLabel("github", proj.link) : "";
      const linkUrl = proj.link ? getContactHref("github", proj.link) : "";

      pdf.setFont("times", "normal");
      pdf.setFontSize(8.4);
      const linkWidth = linkLabel ? Math.min(pdf.getTextWidth(linkLabel) + 4, 68) : 0;

      pdf.setFont("times", "bold");
      pdf.setFontSize(9.6);
      const leftLines = pdf.splitTextToSize(
        headerLeft,
        contentWidth - linkWidth
      ) as string[];

      leftLines.forEach((line, idx) => {
        ensureSpace(4.1);
        pdf.setFont("times", "bold");
        pdf.setFontSize(9.6);
        pdf.setTextColor(0, 0, 0);
        pdf.text(line, marginX, y);

        if (idx === 0 && linkLabel && linkUrl) {
          pdf.setFont("times", "normal");
          pdf.setFontSize(8.3);
          pdf.setTextColor(40, 40, 40);
          const actualW = pdf.getTextWidth(linkLabel);
          pdf.textWithLink(linkLabel, pageWidth - marginX - actualW, y, {
            url: linkUrl,
          });
        }
        y += 4.1;
      });

      renderBullets(proj.description);
      y += 1.8;
    });
  };

  const renderEducation = () => {
    if (!resume.education?.length) return;
    drawSectionHeading("Education");

    resume.education.forEach((edu) => {
      ensureSpace(11);
      const institution = (edu.institution || "").trim();
      const location = (edu.location || "").trim();
      const degreeLine = `${(edu.degree || "").trim()}${
        edu.gpa ? ` • GPA: ${edu.gpa.trim()}` : ""
      }`.trim();
      const gradDate = (edu.graduationDate || "").trim();

      pdf.setFont("times", "normal");
      pdf.setFontSize(8.8);
      const locW = location ? pdf.getTextWidth(location) + 4 : 0;

      pdf.setFont("times", "bold");
      pdf.setFontSize(9.6);
      const instLines = pdf.splitTextToSize(
        institution,
        contentWidth - locW
      ) as string[];
      instLines.forEach((line, idx) => {
        ensureSpace(4.1);
        pdf.setFont("times", "bold");
        pdf.setFontSize(9.6);
        pdf.setTextColor(0, 0, 0);
        pdf.text(line, marginX, y);
        if (idx === 0 && location) {
          pdf.setFont("times", "normal");
          pdf.setFontSize(8.8);
          pdf.setTextColor(65, 65, 65);
          pdf.text(location, pageWidth - marginX, y, { align: "right" });
        }
        y += 4.1;
      });

      if (degreeLine || gradDate) {
        pdf.setFont("times", "italic");
        pdf.setFontSize(8.8);
        const gradW = gradDate ? pdf.getTextWidth(gradDate) + 4 : 0;
        const degLines = degreeLine
          ? (pdf.splitTextToSize(degreeLine, contentWidth - gradW) as string[])
          : [""];
        degLines.forEach((line, idx) => {
          ensureSpace(4.0);
          if (line) {
            pdf.setFont("times", "italic");
            pdf.setFontSize(9.1);
            pdf.setTextColor(25, 25, 25);
            pdf.text(line, marginX, y);
          }
          if (idx === 0 && gradDate) {
            pdf.setFont("times", "italic");
            pdf.setFontSize(8.8);
            pdf.setTextColor(65, 65, 65);
            pdf.text(gradDate, pageWidth - marginX, y, { align: "right" });
          }
          y += 4.0;
        });
      }

      const courseworkText = (edu.coursework || edu.description || "").trim();
      if (courseworkText) {
        pdf.setFont("times", "normal");
        pdf.setFontSize(8.8);
        const label = edu.coursework ? "Coursework: " : "";
        const cwLines = pdf.splitTextToSize(
          `${label}${courseworkText}`,
          contentWidth
        ) as string[];
        drawWrappedLines(cwLines, marginX, 3.8, "normal", 8.8, [45, 45, 45]);
      }
      y += 1.6;
    });
  };

  const renderCertifications = () => {
    if (!resume.certifications?.length) return;
    drawSectionHeading("Certifications");
    resume.certifications.forEach((cert) => {
      ensureSpace(5);
      const label = `• ${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""}`;
      const dateStr = (cert.date || "").trim();
      pdf.setFont("times", "normal");
      pdf.setFontSize(8.8);
      const dateW = dateStr ? pdf.getTextWidth(dateStr) + 4 : 0;
      const lines = pdf.splitTextToSize(label, contentWidth - dateW) as string[];
      lines.forEach((line, idx) => {
        ensureSpace(4.0);
        pdf.setFont("times", "normal");
        pdf.setFontSize(8.8);
        pdf.setTextColor(25, 25, 25);
        pdf.text(line, marginX, y);
        if (idx === 0 && dateStr) {
          pdf.setTextColor(70, 70, 70);
          pdf.text(dateStr, pageWidth - marginX, y, { align: "right" });
        }
        y += 4.0;
      });
    });
    y += 1.4;
  };

  const renderAchievements = () => {
    if (!resume.achievements?.length) return;
    drawSectionHeading("Honors & Achievements");
    pdf.setFont("times", "normal");
    pdf.setFontSize(9.0);
    pdf.setTextColor(25, 25, 25);

    resume.achievements.forEach((item) => {
      const cleaned = item.trim();
      if (!cleaned) return;
      const lines = pdf.splitTextToSize(cleaned, contentWidth - 5.8) as string[];
      lines.forEach((line, idx) => {
        ensureSpace(4.0);
        if (idx === 0) pdf.text("•", marginX + 2.5, y);
        pdf.text(line, marginX + 5.8, y);
        y += 4.0;
      });
    });
    y += 1.0;
  };

  // Adaptive template section order
  const norm = normalizeTemplateId(templateId || "frontend");
  let order: Array<() => void>;

  if (norm === "fresher" || norm === "cs-it") {
    order = [
      renderSummary,
      renderEducation,
      renderSkills,
      renderProjects,
      renderExperience,
      renderCertifications,
      renderAchievements,
    ];
  } else if (norm === "opensource") {
    order = [
      renderSummary,
      renderProjects,
      renderExperience,
      renderSkills,
      renderEducation,
      renderCertifications,
      renderAchievements,
    ];
  } else if (norm === "sde" || norm === "faang") {
    order = [
      renderSummary,
      renderEducation,
      renderExperience,
      renderSkills,
      renderProjects,
      renderCertifications,
      renderAchievements,
    ];
  } else {
    order = [
      renderSummary,
      renderSkills,
      renderExperience,
      renderProjects,
      renderEducation,
      renderCertifications,
      renderAchievements,
    ];
  }

  order.forEach((renderFn) => renderFn());

  pdf.save(`${fileName}.pdf`);
};

export const exportToDOCX = async (data: unknown, fileName: string) => {
  const resume = data as ResumeData;
  const children: Paragraph[] = [];

  if (resume.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: resume.fullName, bold: true, size: 36 }),
        ],
      })
    );
  }

  const contactParts = [
    resume.jobTitle,
    resume.location,
    resume.phone,
    resume.email,
    resume.linkedin,
    resume.github,
    resume.leetcode,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 20,
            color: "555555",
          }),
        ],
      })
    );
  }

  if (resume.summary || resume.aboutMe) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "\nPROFESSIONAL SUMMARY", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: resume.summary || resume.aboutMe || "",
            size: 20,
          }),
        ],
      })
    );
  }

  const cat = categorizeSkills(resume);
  const skillLines: { label: string; values: string[] }[] = [
    { label: "Languages", values: cat.languages },
    { label: "Frontend & UI", values: cat.frontend },
    { label: "Backend & APIs", values: cat.backend },
    { label: "Databases", values: cat.databases },
    { label: "Developer Tools", values: cat.tools },
    { label: "Core CS", values: cat.coreCS },
    { label: "AI & ML", values: cat.ai },
    { label: "Additional Skills", values: cat.other },
  ].filter((s) => s.values.length > 0);

  if (skillLines.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "\nTECHNICAL SKILLS", bold: true, size: 24 }),
        ],
      })
    );
    skillLines.forEach((row) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${row.label}: `, bold: true, size: 20 }),
            new TextRun({ text: row.values.join(", "), size: 20 }),
          ],
        })
      );
    });
  }

  if (resume.experiences?.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nEXPERIENCE", bold: true, size: 24 })],
      })
    );
    resume.experiences.forEach((exp) => {
      const role =
        exp.jobTitle ||
        (exp as unknown as { title?: string }).title ||
        "";
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${role}${role && exp.company ? " — " : ""}${exp.company || ""}`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: ` (${exp.startDate || ""} - ${
                exp.current ? "Present" : exp.endDate || ""
              })`,
              italics: true,
              size: 20,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.description || "", size: 20 })],
        })
      );
    });
  }

  if (resume.projects?.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nPROJECTS", bold: true, size: 24 })],
      })
    );
    resume.projects.forEach((proj) => {
      const techText = Array.isArray(proj.technologies)
        ? (proj.technologies as string[]).join(", ")
        : typeof proj.technologies === "string"
        ? proj.technologies
        : "";
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.title, bold: true, size: 22 }),
            new TextRun({
              text: techText?.trim() ? ` | ${techText.trim()}` : "",
              italics: true,
              size: 20,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: proj.description || "", size: 20 })],
        })
      );
    });
  }

  if (resume.education?.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nEDUCATION", bold: true, size: 24 })],
      })
    );
    resume.education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} — ${edu.institution}`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: edu.graduationDate ? ` (${edu.graduationDate})` : "",
              italics: true,
              size: 20,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: edu.coursework
                ? `Coursework: ${edu.coursework}`
                : edu.description || "",
              size: 20,
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
};