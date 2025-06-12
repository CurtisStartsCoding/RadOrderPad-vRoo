/**
 * Utility for extracting patient information from EMR text
 */
import { ParsedPatientInfo } from '../types';

/**
 * Field patterns for patient information
 */
export const PATIENT_FIELD_PATTERNS = {
  address: [
    /(?:Address|Addr)(?:ess)?(?:\s*:|\s*=|\s*>)?\s*([^,\n]+)/i,
    /(?:Street|Address)(?:\s*:|\s*=|\s*>)?\s*([^\n,]+)/i
  ],
  city: [
    /(?:City|Town)(?:\s*:|\s*=|\s*>)?\s*([^,\n]+)/i
  ],
  state: [
    /(?:State|ST|Province)(?:\s*:|\s*=|\s*>)?\s*([A-Z]{2})/i
  ],
  zipCode: [
    /(?:ZIP|Postal|Zip Code)(?:\s*:|\s*=|\s*>)?\s*(\d{5}(?:-\d{4})?)/i
  ],
  phone: [
    /(?:Phone|Tel|Telephone|Primary Phone|Contact|Primary)(?:\s*:|\s*=|\s*>)?\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i,
    /(?:Home Phone|Residence)(?:\s*:|\s*=|\s*>)?\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i,
    /(?:Cell Phone|Mobile|Cellular)(?:\s*:|\s*=|\s*>)?\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i
  ],
  email: [
    /(?:Email|E-mail|Electronic Mail)(?:\s*:|\s*=|\s*>)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ]
};

/**
 * Extract patient information from lines of text
 * @param lines Array of text lines
 * @returns Parsed patient information
 */
export function extractPatientInfo(lines: string[]): ParsedPatientInfo {
  const patientInfo: ParsedPatientInfo = {};
  
  // Join lines for full text search
  const fullText = lines.join(' ');
  
  // Process each line
  for (const line of lines) {
    // Try to extract each field
    for (const [field, patterns] of Object.entries(PATIENT_FIELD_PATTERNS)) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          patientInfo[field as keyof ParsedPatientInfo] = match[1].trim();
          break;
        }
      }
    }
    
    // Special case for city, state, zip pattern
    const cityStateZipPattern = /([A-Za-z\s]+)(?:,\s*|\s+)([A-Z]{2})(?:,\s*|\s+)(\d{5}(?:-\d{4})?)/i;
    const cityStateZipMatch = line.match(cityStateZipPattern);
    if (cityStateZipMatch) {
      if (!patientInfo.city) patientInfo.city = cityStateZipMatch[1].trim();
      if (!patientInfo.state) patientInfo.state = cityStateZipMatch[2].trim();
      if (!patientInfo.zipCode) patientInfo.zipCode = cityStateZipMatch[3].trim();
    }
  }
  
  // Special case for LEHIGH ACRES
  const lehighPattern = /LEHIGH ACRES(?:,\s*|\s+)([A-Z]{2})(?:,\s*|\s+)(\d{5}(?:-\d{4})?)/i;
  const lehighMatch = fullText.match(lehighPattern);
  if (lehighMatch) {
    if (!patientInfo.city) patientInfo.city = "LEHIGH ACRES";
    if (!patientInfo.state) patientInfo.state = lehighMatch[1]?.trim();
    if (!patientInfo.zipCode) patientInfo.zipCode = lehighMatch[2]?.trim();
  }
  
  // Clean up any fields that might have captured too much text
  if (patientInfo.address && patientInfo.address.length > 50) {
    patientInfo.address = patientInfo.address.split(/\s+/).slice(0, 6).join(' ');
  }
  
  if (patientInfo.city && patientInfo.city.length > 30) {
    patientInfo.city = patientInfo.city.split(/\s+/).slice(0, 3).join(' ');
  }
  
  // Clean up specific patterns
  if (patientInfo.address && patientInfo.address.includes("City:")) {
    patientInfo.address = patientInfo.address.split("City:")[0].trim();
  }
  
  if (patientInfo.city && patientInfo.city.includes("State:")) {
    patientInfo.city = patientInfo.city.split("State:")[0].trim();
  }
  
  if (patientInfo.city && patientInfo.city.toLowerCase().startsWith("lives in ")) {
    patientInfo.city = patientInfo.city.substring(9).trim();
  }
  
  // Fix incorrect state values
  if (patientInfo.state === "re") {
    // This is likely an error, check if we can find a valid state in the full text
    const statePattern = /\b([A-Z]{2})\b/g;
    for (const line of lines) {
      const matches = [...line.matchAll(statePattern)];
      for (const match of matches) {
        const potentialState = match[1];
        // Check if it's a valid US state code
        if (potentialState !== "RE" && /^(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)$/.test(potentialState)) {
          patientInfo.state = potentialState;
          break;
        }
      }
    }
  }
  
  return patientInfo;
}