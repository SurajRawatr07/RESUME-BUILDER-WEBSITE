/**
 * Utility functions for resume formatting, text parsing, and url normalization.
 */

export function cleanUrl(url?: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

export function ensureHttp(url?: string): string {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export function formatBulletPoints(text?: string): string[] {
  if (!text) return [];
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const line of lines) {
    const cleanLine = line.replace(/^([•\-–*]|\d+\.)\s*/, '').trim();
    if (cleanLine) {
      bullets.push(cleanLine);
    }
  }

  if (bullets.length === 0 && text.trim()) {
    return [text.trim()];
  }
  return bullets;
}
