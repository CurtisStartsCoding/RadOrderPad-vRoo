import { PartialInformation } from './types';

/**
 * Extract partial information from a malformed response
 */
export function extractPartialInformation(responseContent: string): PartialInformation {
  const result: PartialInformation = {};
  
  // Try to extract compliance score
  const scoreMatch = responseContent.match(/(?:compliance|score)[\s:]+(\d+)/i);
  if (scoreMatch) {
    result.complianceScore = parseInt(scoreMatch[1], 10);
  }
  
  // Try to extract feedback
  const feedbackMatch = responseContent.match(/feedback[\s:]+([^\n]+)/i);
  if (feedbackMatch) {
    result.feedback = feedbackMatch[1].trim();
  }
  
  // Try to extract ICD-10 codes
  const icd10Matches = responseContent.match(/[A-Z]\d{2}(?:\.\d{1,2})?/g);
  if (icd10Matches) {
    result.icd10Codes = [...new Set(icd10Matches)].map(code => ({
      code,
      description: ''
    }));
  }
  
  // Try to extract CPT codes
  const cptMatches = responseContent.match(/\b\d{5}\b/g);
  if (cptMatches) {
    // Filter to likely CPT codes (starting with 7 for radiology)
    const likelyCptCodes = cptMatches.filter(code => code.startsWith('7'));
    if (likelyCptCodes.length > 0) {
      result.cptCodes = likelyCptCodes.map(code => ({
        code,
        description: ''
      }));
    }
  }
  
  return result;
}