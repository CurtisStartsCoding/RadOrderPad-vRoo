/**
 * Utility functions for date formatting
 */

/**
 * Format a date string to a more readable format
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "Apr 17, 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format the date
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

/**
 * Format a date string to include time
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date and time string (e.g., "Apr 17, 2025, 3:21 PM")
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format the date and time
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Error';
  }
};