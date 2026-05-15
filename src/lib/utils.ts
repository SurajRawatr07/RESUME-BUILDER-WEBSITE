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

// PDF EXPORT
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (id: string, fileName: string) => {
  const element = document.getElementById(id);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 297;

  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
};

// DOCX EXPORT
import { Document, Packer, Paragraph, TextRun } from "docx";

export const exportToDOCX = async (data: any, fileName: string) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun(JSON.stringify(data, null, 2)),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.docx`;
  a.click();

  window.URL.revokeObjectURL(url);
};