/**
 * Format a date string to a human-readable format
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Apr 17, 2025")
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format a date string to include time
 * 
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "Apr 17, 2025, 2:30 PM")
 */
export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Get a date string for the current date in ISO format
 * 
 * @returns Current date in ISO format (YYYY-MM-DD)
 */
export const getCurrentDateString = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

/**
 * Get a date string for a date N days ago in ISO format
 * 
 * @param daysAgo - Number of days to go back
 * @returns Date in ISO format (YYYY-MM-DD)
 */
export const getDateDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};