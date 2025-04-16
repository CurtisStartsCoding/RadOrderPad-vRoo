/**
 * Utility functions for sanitizing PHI (Personal Health Information) from text
 */
import { PHISanitizerOptions } from './types';
/**
 * Strip PHI (Personal Health Information) from text
 * This is a basic implementation that removes obvious identifiers
 * In a production environment, this would be more sophisticated
 *
 * @param text - The text to sanitize
 * @param options - Options for PHI sanitization
 * @returns Sanitized text with PHI removed
 */
export declare function stripPHI(text: string, options?: PHISanitizerOptions): string;
