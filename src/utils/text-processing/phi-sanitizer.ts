/**
 * Utility functions for sanitizing PHI (Personal Health Information) from text
 */
import { PHISanitizerOptions } from './types';

/**
 * Default options for PHI sanitization
 */
const DEFAULT_PHI_SANITIZER_OPTIONS: PHISanitizerOptions = {
  sanitizeMRN: true,
  sanitizeSSN: true,
  sanitizePhoneNumbers: true,
  sanitizeDates: true,
  sanitizeNames: true,
  sanitizeEmails: true,
  sanitizeURLs: true,
  sanitizeAddresses: true,
  sanitizeZipCodes: true
};

/**
 * Strip PHI (Personal Health Information) from text
 * This is a basic implementation that removes obvious identifiers
 * In a production environment, this would be more sophisticated
 * 
 * @param text - The text to sanitize
 * @param options - Options for PHI sanitization
 * @returns Sanitized text with PHI removed
 */
export function stripPHI(text: string, options: PHISanitizerOptions = DEFAULT_PHI_SANITIZER_OPTIONS): string {
  // Start with the original text
  let sanitizedText = text;
  
  // Replace potential MRN numbers (Medical Record Numbers)
  if (options.sanitizeMRN) {
    sanitizedText = sanitizedText.replace(/\b[A-Z]{0,3}\d{5,10}\b/g, '[MRN]');
  }
  
  // Replace potential SSNs
  if (options.sanitizeSSN) {
    sanitizedText = sanitizedText.replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[SSN]');
  }
  
  // Replace potential phone numbers (various formats)
  if (options.sanitizePhoneNumbers) {
    sanitizedText = sanitizedText.replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, '[PHONE]');
    sanitizedText = sanitizedText.replace(/\(\d{3}\)\s*\d{3}[-\s]?\d{4}\b/g, '[PHONE]');
    sanitizedText = sanitizedText.replace(/\b1[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, '[PHONE]');
  }
  
  // Replace potential dates (various formats, but preserve age references)
  if (options.sanitizeDates) {
    sanitizedText = sanitizedText.replace(/\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-](19|20)\d{2}\b/g, '[DATE]');
    sanitizedText = sanitizedText.replace(/\b(19|20)\d{2}[/-](0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])\b/g, '[DATE]');
    sanitizedText = sanitizedText.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (0?[1-9]|[12]\d|3[01])(st|nd|rd|th)?,? (19|20)\d{2}\b/gi, '[DATE]');
  }
  
  // Replace potential full names (improved patterns)
  if (options.sanitizeNames) {
    // This looks for patterns like "John Smith", "Smith, John", "John A. Smith", etc.
    sanitizedText = sanitizedText.replace(/\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)+\b/g, '[NAME]');
    sanitizedText = sanitizedText.replace(/\b[A-Z][a-z]+,\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\b/g, '[NAME]');
  }
  
  // Replace email addresses
  if (options.sanitizeEmails) {
    sanitizedText = sanitizedText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL]');
  }
  
  // Replace URLs that might contain identifying information
  if (options.sanitizeURLs) {
    sanitizedText = sanitizedText.replace(/https?:\/\/[^\s]+/g, '[URL]');
  }
  
  // Replace potential addresses
  if (options.sanitizeAddresses) {
    sanitizedText = sanitizedText.replace(/\b\d+\s+[A-Za-z\s]+(?:Avenue|Ave|Street|St|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Terrace|Ter)\b/gi, '[ADDRESS]');
  }
  
  // Replace potential zip codes
  if (options.sanitizeZipCodes) {
    sanitizedText = sanitizedText.replace(/\b\d{5}(?:-\d{4})?\b/g, '[ZIP]');
  }
  
  return sanitizedText;
}