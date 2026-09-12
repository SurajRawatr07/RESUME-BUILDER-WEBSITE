import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

// PDF EXPORT
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { ResumeData } from "@/types/resume";

export const exportToPDF = async (id: string, fileName: string) => {
  const element = document.getElementById(id) || document.querySelector(".resume-preview");
  if (!element) return;

  const canvas = await html2canvas(element as HTMLElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: 1200,
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 297;

  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
  heightLeft -= pageHeight;

  // Only paginate if significant content overflow (> 4mm)
  while (heightLeft > 4) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
  }

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
          new TextRun({ text: contactParts.join(" | "), size: 20, color: "555555" }),
        ],
      })
    );
  }

  if (resume.summary) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nPROFESSIONAL SUMMARY", bold: true, size: 24 })],
      }),
      new Paragraph({
        children: [new TextRun({ text: resume.summary, size: 20 })],
      })
    );
  }

  if (resume.technicalSkills) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nTECHNICAL SKILLS", bold: true, size: 24 })],
      })
    );
    if (resume.technicalSkills.languages?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Languages: ", bold: true, size: 20 }),
            new TextRun({ text: resume.technicalSkills.languages.join(", "), size: 20 }),
          ],
        })
      );
    }
    if (resume.technicalSkills.frameworks?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Frameworks & Libraries: ", bold: true, size: 20 }),
            new TextRun({ text: resume.technicalSkills.frameworks.join(", "), size: 20 }),
          ],
        })
      );
    }
    if (resume.technicalSkills.developerTools?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Developer Tools: ", bold: true, size: 20 }),
            new TextRun({ text: resume.technicalSkills.developerTools.join(", "), size: 20 }),
          ],
        })
      );
    }
    if (resume.technicalSkills.databases?.length) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Databases: ", bold: true, size: 20 }),
            new TextRun({ text: resume.technicalSkills.databases.join(", "), size: 20 }),
          ],
        })
      );
    }
  }

  if (resume.experiences?.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "\nEXPERIENCE", bold: true, size: 24 })],
      })
    );
    resume.experiences.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.title} — ${exp.company}`, bold: true, size: 22 }),
            new TextRun({
              text: ` (${exp.startDate || ""} - ${exp.endDate || (exp.current ? "Present" : "")})`,
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
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.title, bold: true, size: 22 }),
            new TextRun({
              text: proj.technologies?.length ? ` | ${proj.technologies.join(", ")}` : "",
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
            new TextRun({ text: `${edu.degree} — ${edu.institution}`, bold: true, size: 22 }),
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
              text: edu.coursework ? `Coursework: ${edu.coursework}` : edu.description || "",
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