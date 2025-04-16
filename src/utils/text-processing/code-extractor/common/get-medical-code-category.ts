import { MedicalKeywordCategory } from '../../types';
import { isMedicalCode } from './is-medical-code';

/**
 * Get the category of a medical code
 * @param code - The code to categorize
 * @returns The category of the code, or undefined if not a medical code
 */
export function getMedicalCodeCategory(code: string): MedicalKeywordCategory | undefined {
  if (isMedicalCode(code)) {
    return MedicalKeywordCategory.CODE;
  }
  
  return undefined;
}