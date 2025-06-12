import { ParsedEmrData } from './types';
import { normalizeText, splitIntoLines } from './utils/textNormalizer';
import { identifySections } from './utils/sectionDetector';
import { extractPatientInfo } from './utils/patientInfoExtractor';
import { extractInsuranceInfo } from './utils/insuranceInfoExtractor';
import logger from '../../../utils/logger';

/**
 * Parse EMR summary text to extract patient and insurance information
 * Enhanced version with better pattern matching and format handling
 * @param text EMR summary text
 * @returns Parsed data
 */
export function parseEmrSummary(text: string): ParsedEmrData {
  try {
    // Initialize parsed data structure
    const parsedData: ParsedEmrData = {
      patientInfo: {},
      insuranceInfo: {}
    };
    
    // Step 1: Normalize text (but preserve more structure)
    const normalizedText = normalizeText(text);
    
    // Step 2: Split into lines
    const lines = splitIntoLines(normalizedText);
    
    // Step 3: Try section-based extraction first
    const sections = identifySections(lines);
    
    // Step 4: Extract patient information
    // Try section-specific extraction first
    const patientSection = sections.get('patient');
    if (patientSection && patientSection.length > 0) {
      parsedData.patientInfo = extractPatientInfo(patientSection);
    }
    
    // If we didn't get enough data from sections, try the full text
    const patientFieldsFound = Object.keys(parsedData.patientInfo || {}).length;
    if (patientFieldsFound < 3) {
      // Try extracting from the full text
      const fullTextPatientInfo = extractPatientInfo(lines);
      
      // Merge the results, preferring section-based extraction
      parsedData.patientInfo = {
        ...fullTextPatientInfo,
        ...parsedData.patientInfo
      };
    }
    
    // Step 5: Extract insurance information
    // Try section-specific extraction first
    const insuranceSection = sections.get('insurance');
    if (insuranceSection && insuranceSection.length > 0) {
      parsedData.insuranceInfo = extractInsuranceInfo(insuranceSection);
    }
    
    // If we didn't get enough data from sections, try the full text
    const insuranceFieldsFound = Object.keys(parsedData.insuranceInfo || {}).length;
    if (insuranceFieldsFound < 2) {
      // Try extracting from the full text
      const fullTextInsuranceInfo = extractInsuranceInfo(lines);
      
      // Merge the results, preferring section-based extraction
      parsedData.insuranceInfo = {
        ...fullTextInsuranceInfo,
        ...parsedData.insuranceInfo
      };
    }
    
    // Log extraction statistics
    const stats = {
      patientFieldsExtracted: Object.keys(parsedData.patientInfo || {}).length,
      insuranceFieldsExtracted: Object.keys(parsedData.insuranceInfo || {}).length,
      sectionsFound: Array.from(sections.keys()),
      totalLines: lines.length
    };
    
    logger.info('Enhanced EMR Parser statistics:', stats);
    
    return parsedData;
  } catch (error) {
    // Log the error but don't throw it - we want to return as much data as we can
    logger.error('Error in EMR parser:', error instanceof Error ? error.message : String(error));
    return {
      patientInfo: {},
      insuranceInfo: {}
    };
  }
}

export default parseEmrSummary;