import { ParsedEmrData } from './types';

/**
 * Parse EMR summary text to extract patient and insurance information
 * @param text EMR summary text
 * @returns Parsed data
 */
export function parseEmrSummary(text: string): ParsedEmrData {
  // Initialize parsed data structure
  const parsedData: ParsedEmrData = {
    patientInfo: {},
    insuranceInfo: {}
  };
  
  // Extract patient address
  const addressRegex = /(?:Address|Addr):\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([A-Z]{2}))?(?:,?\s*(\d{5}(?:-\d{4})?))?/i;
  const addressMatch = text.match(addressRegex);
  if (addressMatch) {
    parsedData.patientInfo!.address = addressMatch[1]?.trim();
    parsedData.patientInfo!.city = addressMatch[2]?.trim();
    parsedData.patientInfo!.state = addressMatch[3]?.trim();
    parsedData.patientInfo!.zipCode = addressMatch[4]?.trim();
  }
  
  // Extract patient phone
  const phoneRegex = /(?:Phone|Tel|Telephone):\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    parsedData.patientInfo!.phone = phoneMatch[1]?.trim();
  }
  
  // Extract patient email
  const emailRegex = /(?:Email|E-mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    parsedData.patientInfo!.email = emailMatch[1]?.trim();
  }
  
  // Extract insurance information
  const insuranceRegex = /(?:Insurance|Ins)(?:urance)?(?:\s*Provider)?:\s*([^\n,]+)(?:,|\n|$)/i;
  const insuranceMatch = text.match(insuranceRegex);
  if (insuranceMatch) {
    parsedData.insuranceInfo!.insurerName = insuranceMatch[1]?.trim();
  }
  
  // Extract policy number
  const policyRegex = /(?:Policy|Member|ID)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i;
  const policyMatch = text.match(policyRegex);
  if (policyMatch) {
    parsedData.insuranceInfo!.policyNumber = policyMatch[1]?.trim();
  }
  
  // Extract group number
  const groupRegex = /(?:Group|Grp)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i;
  const groupMatch = text.match(groupRegex);
  if (groupMatch) {
    parsedData.insuranceInfo!.groupNumber = groupMatch[1]?.trim();
  }
  
  // Extract policy holder name
  const holderRegex = /(?:Policy\s*Holder|Subscriber|Insured)(?:\s*Name)?\s*:\s*([^\n,]+)(?:,|\n|$)/i;
  const holderMatch = text.match(holderRegex);
  if (holderMatch) {
    parsedData.insuranceInfo!.policyHolderName = holderMatch[1]?.trim();
  }
  
  return parsedData;
}

export default parseEmrSummary;