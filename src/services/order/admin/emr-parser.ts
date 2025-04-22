import { ParsedEmrData } from './types';
import { normalizeText, splitIntoLines } from './utils/textNormalizer';
import { identifySections } from './utils/sectionDetector';
import { extractPatientInfo } from './utils/patientInfoExtractor';
import { extractInsuranceInfo } from './utils/insuranceInfoExtractor';
import logger from '../../../utils/logger';

/**
 * Parse EMR summary text to extract patient and insurance information
 * Enhanced version with modular, declarative approach
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
    
    // Step 1: Normalize text
    const normalizedText = normalizeText(text);
    
    // Step 2: Split into lines
    const lines = splitIntoLines(normalizedText);
    
    // Step 3: Identify sections
    const sections = identifySections(lines);
    
    // Step 4: Extract patient information
    const patientSection = sections.get('patient') || sections.get('default') || [];
    parsedData.patientInfo = extractPatientInfo(patientSection);
    
    // Step 5: Extract insurance information
    const insuranceSection = sections.get('insurance') || sections.get('default') || [];
    parsedData.insuranceInfo = extractInsuranceInfo(insuranceSection);
    
    // Log the extracted data for debugging
    logger.debug('EMR Parser extracted data:', {
      patientInfo: parsedData.patientInfo,
      insuranceInfo: parsedData.insuranceInfo
    });
    
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