/**
 * Utility for extracting insurance information from EMR text
 */
import { ParsedInsuranceInfo } from '../types';

/**
 * Field patterns for insurance information
 */
export const INSURANCE_FIELD_PATTERNS = {
  insurerName: [
    /(?:Insurance|Ins)(?:urance)?(?:\s*Provider|Company|Carrier|Plan)?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z\s&]+)/i,
    /(?:PRIMARY INSURANCE|COVERAGE|PAYER|Primary)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z\s&]+)/i,
    /(?:^|\s)Ins(?:urance)?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z\s&]+)/i,
    /Insurance\s+is\s+([A-Za-z\s&]+)/i
  ],
  policyNumber: [
    /(?:Policy|Member|ID|Subscriber|Insurance)(?:\s*(?:Number|#|No|ID))(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /(?:Subscriber ID|Member ID|Policy ID)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /(?:ID|Number)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /ID\s+#:\s*([A-Za-z0-9-]+)/i
  ],
  groupNumber: [
    /(?:Group|Grp)(?:\s*(?:Number|#|No|ID))?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /(?:GroupNumber|Group ID|Plan Number)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /Group\s+#:\s*([A-Za-z0-9-]+)/i
  ],
  policyHolderName: [
    /(?:Policy\s*Holder|Subscriber|Insured|Guarantor)(?:\s*Name)?(?:\s*:|\s*=|\s*>)?\s*([^\n,;]+)/i,
    /(?:Subscriber Name|Insured Name|Guarantor Name)(?:\s*:|\s*=|\s*>)?\s*([^\n,;]+)/i,
    /Subscriber:\s*([^\n,;]+)/i
  ],
  relationship: [
    /(?:Relation|Relationship)(?:\s*to\s*(?:Subscriber|Insured|Guarantor|Patient))?(?:\s*:|\s*=|\s*>)?\s*([^\n,;]+)/i,
    /(?:Rel\.to Subscriber|Rel to Patient)(?:\s*:|\s*=|\s*>)?\s*([^\n,;]+)/i,
    /Relationship:\s*([^\n,;]+)/i,
    /Rel(?:ationship)?(?:\s*to\s*Subscriber)?:\s*([^\n,;]+)/i
  ],
  authorizationNumber: [
    /(?:Authorization|Auth)(?:\s*(?:Number|#|No))?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /(?:Approval|Referral)(?:\s*(?:Number|#|No))?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9-]+)/i,
    /Auth\s+#:\s*([A-Za-z0-9-]+)/i
  ]
};

/**
 * Common insurance company names to check for
 */
export const COMMON_INSURERS = [
  "UNITED HEALTH", "BLUE CROSS", "BLUE SHIELD", "AETNA", "CIGNA", 
  "HUMANA", "MEDICARE", "MEDICAID", "TRICARE", "ANTHEM", "KAISER", 
  "UHC", "BCBS"
];

/**
 * Extract insurance information from lines of text
 * @param lines Array of text lines
 * @returns Parsed insurance information
 */
export function extractInsuranceInfo(lines: string[]): ParsedInsuranceInfo {
  const insuranceInfo: ParsedInsuranceInfo = {};
  
  // First check for common insurance names in the text
  const fullText = lines.join(' ');
  for (const insurer of COMMON_INSURERS) {
    if (fullText.includes(insurer)) {
      insuranceInfo.insurerName = insurer;
      break;
    }
  }
  
  // Special handling for Epic EMR format
  if (fullText.includes("Insurance Provider:")) {
    const epicMatch = fullText.match(/Insurance Provider:\s*([A-Za-z\s&]+)(?:\s|,|;|\n|$)/i);
    if (epicMatch && epicMatch[1]) {
      // Limit to first few words to avoid capturing "Policy" and other terms
      const words = epicMatch[1].trim().split(/\s+/);
      // For Blue Cross Blue Shield, we want to keep all three words
      if (words.length >= 3 &&
          words[0].toLowerCase() === "blue" &&
          words[1].toLowerCase() === "cross" &&
          words[2].toLowerCase() === "blue") {
        insuranceInfo.insurerName = "Blue Cross Blue Shield";
      } else if (words.length >= 3 &&
                words[0].toLowerCase() === "blue" &&
                words[1].toLowerCase() === "cross") {
        insuranceInfo.insurerName = "Blue Cross";
      } else {
        // For other insurers, limit to first 2-3 words
        const limitedWords = words.slice(0, Math.min(3, words.length));
        insuranceInfo.insurerName = limitedWords.join(' ');
      }
    }
  }
  
  // Special handling for eClinicalWorks format
  if (fullText.includes("Insurance Details") || fullText.includes("Ins:")) {
    const ecwMatch = fullText.match(/Ins:\s*([A-Za-z\s&]+)(?:\s|,|;|\n|$)/i);
    if (ecwMatch && ecwMatch[1]) {
      // Just get the first word (usually the insurer name)
      const firstWord = ecwMatch[1].trim().split(/\s+/)[0];
      insuranceInfo.insurerName = firstWord;
    }
  }
  
  // Special handling for "Insurance is X" format
  if (fullText.includes("Insurance is")) {
    const isMatch = fullText.match(/Insurance\s+is\s+([A-Za-z\s&]+)(?:\s|,|;|\n|$)/i);
    if (isMatch && isMatch[1]) {
      insuranceInfo.insurerName = isMatch[1].trim();
    }
  }
  
  // Process each line
  for (const line of lines) {
    // Try to extract each field
    for (const [field, patterns] of Object.entries(INSURANCE_FIELD_PATTERNS)) {
      // Skip insurer name if we already found it
      if (field === 'insurerName' && insuranceInfo.insurerName) continue;
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          // For insurer name, limit to first few words
          if (field === 'insurerName') {
            const words = match[1].trim().split(/\s+/);
            // Special case for Blue Cross Blue Shield
            if (words.length >= 3 &&
                words[0].toLowerCase() === "blue" &&
                words[1].toLowerCase() === "cross" &&
                words[2].toLowerCase() === "blue") {
              insuranceInfo.insurerName = "Blue Cross Blue Shield";
            } else {
              // For other insurers, limit to first 2-3 words
              const limitedWords = words.slice(0, Math.min(3, words.length));
              insuranceInfo.insurerName = limitedWords.join(' ');
            }
          } else {
            insuranceInfo[field as keyof ParsedInsuranceInfo] = match[1].trim();
          }
          break;
        }
      }
    }
  }
  
  // If relationship not found, look for common relationship terms
  if (!insuranceInfo.relationship) {
    if (/\bSelf\b/i.test(fullText)) {
      insuranceInfo.relationship = 'Self';
    } else if (/\bSpouse\b|\bHusband\b|\bWife\b/i.test(fullText)) {
      insuranceInfo.relationship = 'Spouse';
    } else if (/\bChild\b|\bSon\b|\bDaughter\b|\bDependent\b/i.test(fullText)) {
      insuranceInfo.relationship = 'Child';
    }
  }
  
  // Clean up policyHolderName field
  if (insuranceInfo.policyHolderName) {
    // Check if it contains "Relationship" or "Rel to" text
    if (insuranceInfo.policyHolderName.includes('Relationship to')) {
      insuranceInfo.policyHolderName = insuranceInfo.policyHolderName.split('Relationship to')[0].trim();
    } else if (insuranceInfo.policyHolderName.includes('Rel to')) {
      insuranceInfo.policyHolderName = insuranceInfo.policyHolderName.split('Rel to')[0].trim();
    }
    
    // Limit to first 3 words if still too long
    if (insuranceInfo.policyHolderName.length > 30) {
      const words = insuranceInfo.policyHolderName.split(/\s+/);
      insuranceInfo.policyHolderName = words.slice(0, 3).join(' ');
    }
  }
  
  // Clean up relationship field
  if (insuranceInfo.relationship) {
    // Check if it contains "Authorization" or "Auth #" text
    if (insuranceInfo.relationship.includes('Authorization')) {
      insuranceInfo.relationship = insuranceInfo.relationship.split('Authorization')[0].trim();
    } else if (insuranceInfo.relationship.includes('Auth #')) {
      insuranceInfo.relationship = insuranceInfo.relationship.split('Auth #')[0].trim();
    }
    
    // If relationship is "ship to" or similar, fix it
    if (insuranceInfo.relationship.toLowerCase().includes('ship to') ||
        insuranceInfo.relationship.toLowerCase().includes('ship:')) {
      // Check if we can determine the actual relationship
      if (insuranceInfo.relationship.toLowerCase().includes('self')) {
        insuranceInfo.relationship = 'Self';
      } else if (insuranceInfo.relationship.toLowerCase().includes('spouse')) {
        insuranceInfo.relationship = 'Spouse';
      } else if (insuranceInfo.relationship.toLowerCase().includes('child')) {
        insuranceInfo.relationship = 'Child';
      }
    }
  }
  
  return insuranceInfo;
}