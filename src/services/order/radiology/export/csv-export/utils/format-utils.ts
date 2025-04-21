/**
 * Utility functions for formatting data in CSV export
 */

/**
 * Format a date value to ISO string or return empty string if null/undefined
 * @param date Date value to format
 * @returns Formatted date string or empty string
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '';
  
  try {
    return new Date(date).toISOString();
  } catch {
    // Ignore error and return empty string
    return '';
  }
}

/**
 * Format a boolean value to 'Yes' or 'No'
 * @param value Boolean value to format
 * @returns 'Yes', 'No', or empty string
 */
export function formatBoolean(value: boolean | undefined | null): string {
  if (value === undefined || value === null) return '';
  return value ? 'Yes' : 'No';
}

/**
 * Convert any value to a safe string for CSV export
 * @param value Value to convert to string
 * @returns Safe string representation or empty string
 */
export function safeString(value: unknown): string {
  if (value === undefined || value === null) return '';
  
  if (Array.isArray(value)) {
    return value.join('; ');
  }
  
  return String(value);
}

/**
 * Join array values with a separator
 * @param array Array to join
 * @param separator Separator to use (default: '; ')
 * @returns Joined string or empty string
 */
export function joinArray(array: unknown[] | undefined | null, separator: string = '; '): string {
  if (!array || !Array.isArray(array) || array.length === 0) return '';
  return array.filter(Boolean).join(separator);
}