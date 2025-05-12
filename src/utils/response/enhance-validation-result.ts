import { ValidationResult } from '../../models';
import { searchDiagnosisCodes } from '../../services/search/diagnosis-search';
import { searchProcedureCodes } from '../../services/search/procedure-search';
import enhancedLogger from '../enhanced-logger';

/**
 * Enhances validation results with confidence scores from search services
 * 
 * @param validationResult The validation result to enhance
 * @param dictationText The original dictation text
 * @returns Enhanced validation result with confidence scores
 */
export async function enhanceValidationResult(
  validationResult: ValidationResult,
  dictationText: string
): Promise<ValidationResult> {
  try {
    // Create a copy of the validation result to avoid modifying the original
    const enhancedResult: ValidationResult = {
      ...validationResult,
      suggestedICD10Codes: [...validationResult.suggestedICD10Codes],
      suggestedCPTCodes: [...validationResult.suggestedCPTCodes]
    };

    // Extract ICD-10 codes for searching
    const icd10Codes = validationResult.suggestedICD10Codes.map(code => code.code);
    
    if (icd10Codes.length > 0) {
      try {
        // Search for ICD-10 codes to get confidence scores
        const searchQuery = dictationText.length > 100 
          ? dictationText.substring(0, 100) 
          : dictationText;
        
        const icd10SearchResults = await searchDiagnosisCodes(searchQuery);
        
        // Create a map of code to confidence score
        const confidenceMap = new Map<string, number>();
        icd10SearchResults.forEach(result => {
          confidenceMap.set(result.icd10_code, result.score);
        });
        
        // Update confidence scores in the validation result
        enhancedResult.suggestedICD10Codes = enhancedResult.suggestedICD10Codes.map(codeObj => {
          const confidence = confidenceMap.get(codeObj.code);
          return {
            ...codeObj,
            confidence: confidence !== undefined ? confidence : 0.8 // Default to 80% if not found
          };
        });
        
        enhancedLogger.debug('Enhanced ICD-10 codes with confidence scores', {
          originalCodes: icd10Codes,
          enhancedCodes: enhancedResult.suggestedICD10Codes
        });
      } catch (error) {
        enhancedLogger.error('Error enhancing ICD-10 codes with confidence scores', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Extract CPT codes for searching
    const cptCodes = validationResult.suggestedCPTCodes.map(code => code.code);
    
    if (cptCodes.length > 0) {
      try {
        // Search for CPT codes to get confidence scores
        const searchQuery = dictationText.length > 100 
          ? dictationText.substring(0, 100) 
          : dictationText;
        
        const cptSearchResults = await searchProcedureCodes(searchQuery);
        
        // Create a map of code to confidence score
        const confidenceMap = new Map<string, number>();
        cptSearchResults.forEach(result => {
          confidenceMap.set(result.cpt_code, result.score);
        });
        
        // Update confidence scores in the validation result
        enhancedResult.suggestedCPTCodes = enhancedResult.suggestedCPTCodes.map(codeObj => {
          const confidence = confidenceMap.get(codeObj.code);
          return {
            ...codeObj,
            confidence: confidence !== undefined ? confidence : 0.8 // Default to 80% if not found
          };
        });
        
        enhancedLogger.debug('Enhanced CPT codes with confidence scores', {
          originalCodes: cptCodes,
          enhancedCodes: enhancedResult.suggestedCPTCodes
        });
      } catch (error) {
        enhancedLogger.error('Error enhancing CPT codes with confidence scores', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return enhancedResult;
  } catch (error) {
    enhancedLogger.error('Error enhancing validation result', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Return the original validation result if enhancement fails
    return validationResult;
  }
}