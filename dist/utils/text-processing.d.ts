/**
 * Utility functions for text processing
 */
/**
 * Strip PHI (Personal Health Information) from text
 * This is a basic implementation that removes obvious identifiers
 * In a production environment, this would be more sophisticated
 */
export declare function stripPHI(text: string): string;
/**
 * Extract medical keywords from text
 * This is a basic implementation that extracts potential medical terms
 */
export declare function extractMedicalKeywords(text: string): string[];
