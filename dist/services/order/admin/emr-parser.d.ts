import { ParsedEmrData } from './types';
/**
 * Parse EMR summary text to extract patient and insurance information
 * Enhanced version with modular, declarative approach
 * @param text EMR summary text
 * @returns Parsed data
 */
export declare function parseEmrSummary(text: string): ParsedEmrData;
export default parseEmrSummary;
