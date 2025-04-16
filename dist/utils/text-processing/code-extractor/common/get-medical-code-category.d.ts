import { MedicalKeywordCategory } from '../../types';
/**
 * Get the category of a medical code
 * @param code - The code to categorize
 * @returns The category of the code, or undefined if not a medical code
 */
export declare function getMedicalCodeCategory(code: string): MedicalKeywordCategory | undefined;
