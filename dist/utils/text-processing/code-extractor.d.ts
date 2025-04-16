/**
 * Utility functions for extracting medical codes from text
 */
import { MedicalKeywordCategory } from './types';
/**
 * Extract potential ICD-10 codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted ICD-10 codes
 */
export declare function extractICD10Codes(text: string): string[];
/**
 * Extract potential CPT codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted CPT codes
 */
export declare function extractCPTCodes(text: string): string[];
/**
 * Extract all medical codes from text
 * @param text - The text to extract codes from
 * @returns Array of extracted medical codes
 */
export declare function extractMedicalCodes(text: string): string[];
/**
 * Check if a string is a medical code (ICD-10 or CPT)
 * @param text - The string to check
 * @returns True if the string is a medical code
 */
export declare function isMedicalCode(text: string): boolean;
/**
 * Get the category of a medical code
 * @param code - The code to categorize
 * @returns The category of the code, or undefined if not a medical code
 */
export declare function getMedicalCodeCategory(code: string): MedicalKeywordCategory | undefined;
