/**
 * Utility for normalizing text before parsing
 */

/**
 * Normalize text by standardizing line endings and whitespace
 * @param text Raw EMR text
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into lines, trim each line, and remove empty lines
 * @param text Text to split into lines
 * @returns Array of non-empty lines
 */
export function splitIntoLines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}