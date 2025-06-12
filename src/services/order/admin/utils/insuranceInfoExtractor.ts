/**
 * Enhanced utility for extracting insurance information from EMR text
 * Handles more formats, better relationship extraction, and authorization numbers
 */
import { ParsedInsuranceInfo } from '../types';

/**
 * Common insurance company names and their variations
 */
const INSURANCE_COMPANIES: Record<string, string[]> = {
  'Aetna': ['aetna', 'aetna ppo', 'aetna hmo'],
  'Blue Cross Blue Shield': ['blue cross', 'bcbs', 'blue shield', 'anthem', 'empire bcbs'],
  'Cigna': ['cigna', 'cigna hmo', 'cigna ppo'],
  'United Healthcare': ['united healthcare', 'uhc', 'united health'],
  'Humana': ['humana', 'humana ppo', 'humana hmo'],
  'Kaiser': ['kaiser', 'kaiser permanente'],
  'Medicare': ['medicare', 'medicare part a', 'medicare part b', 'medicare advantage'],
  'Medicaid': ['medicaid', 'medi-cal'],
  'Premera': ['premera', 'premera blue cross'],
  'Anthem': ['anthem', 'anthem bcbs'],
  'Horizon': ['horizon', 'horizon bcbs'],
  'Oxford': ['oxford', 'oxford health'],
  'Emblem': ['emblem', 'emblem health'],
  'MetroPlus': ['metroplus', 'metro plus'],
  'Healthfirst': ['healthfirst', 'health first'],
  'Oscar': ['oscar', 'oscar health'],
  'Molina': ['molina', 'molina healthcare']
};

/**
 * Normalize insurance company name
 */
function normalizeInsuranceName(name: string): string {
  const lowerName = name.toLowerCase().trim();
  
  // Check against known companies
  for (const [standard, variations] of Object.entries(INSURANCE_COMPANIES)) {
    for (const variation of variations) {
      if (lowerName.includes(variation)) {
        return standard;
      }
    }
  }
  
  // Clean up common patterns
  const cleaned = name
    .replace(/\s*[-–—]\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/^\W+|\W+$/g, '')
    .trim();
  
  // Capitalize properly
  return cleaned.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Enhanced insurance patterns
 */
const INSURANCE_PATTERNS = {
  insurerName: [
    // Standard labeled patterns
    /(?:Primary Insurance|Insurance Provider|Insurance Company|Insurance Carrier|Carrier|Insurance Plan|Plan Name|Insurer)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z][A-Za-z\s&().-]+?)(?=\s*(?:\||Policy|Member|ID|Group|$))/i,
    
    // Abbreviated patterns
    /(?:Ins|Insurance)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z][A-Za-z\s&().-]+?)(?=\s*(?:\||Pol|Policy|ID|$))/i,
    
    // Table format patterns
    /PRIMARY INSURANCE\s*\n\s*Insurance\s*Company:\s*([A-Za-z][A-Za-z\s&().-]+)/i,
    
    // Epic format
    /([A-Za-z][A-Za-z\s&().-]+?)\s*[-–—]\s*[A-Z0-9]+\s*\(Group:/i,
    
    // Inline format
    /Insurance:\s*([A-Za-z][A-Za-z\s&().-]+?)(?:\s*\||$)/i
  ],
  
  policyNumber: [
    // Standard patterns
    /(?:Policy Number|Policy #|Policy No|Member ID|Member #|ID #|Subscriber ID|Insurance ID)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9][\w\s-]*\w)/i,
    
    // Abbreviated patterns
    /(?:Pol|ID)(?:\s*#|No\.?)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9][\w\s-]*\w)/i,
    
    // Inline patterns
    /(?:Policy|Member|ID):\s*([A-Za-z0-9][\w-]+)/i,
    
    // Special format from images
    /ID\s*#:\s*([A-Za-z0-9][\w-]+)/i
  ],
  
  groupNumber: [
    // Standard patterns
    /(?:Group Number|Group #|Group No|Group ID|Grp #|Grp)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9][\w\s-]*\w)/i,
    
    // Parenthetical pattern
    /\(Group:\s*([A-Za-z0-9][\w-]+)\)/i,
    
    // Inline patterns
    /Group:\s*([A-Za-z0-9][\w-]+)/i,
    
    // Special format
    /Grp(?:#|:)\s*([A-Za-z0-9][\w-]+)/i
  ],
  
  authorizationNumber: [
    // Standard patterns
    /(?:Authorization Number|Authorization #|Auth Number|Auth #|Auth No|Pre-Auth|PreAuth)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9][\w\s-]*\w)/i,
    
    // Abbreviated patterns
    /Auth(?:\s*#)?(?:\s*:|\s*=|\s*>)?\s*([A-Za-z0-9][\w-]+)/i,
    
    // Special formats
    /Authorization\s*#:\s*([A-Za-z0-9][\w-]+)/i
  ]
};

/**
 * Relationship patterns
 */
const RELATIONSHIP_PATTERNS = [
  /(?:Relationship to (?:Subscriber|Patient|Insured)|Rel to Subscriber|Relationship)(?:\s*:|\s*=|\s*>)?\s*(\w+)/i,
  /(?:Subscriber Relationship|Patient Relationship)(?:\s*:|\s*=|\s*>)?\s*(\w+)/i,
  /(?:Rel|Relationship)(?:\s*:|\s*=|\s*>)?\s*(\w+)/i,
  /Subscriber:\s*([^,\n]+?)(?:\s*\||$)/i
];

/**
 * Policy holder name patterns
 */
const POLICY_HOLDER_PATTERNS = [
  /(?:Policy Holder Name|Subscriber Name|Policy Holder|Subscriber|Insured Name)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z][A-Za-z\s,.-]+?)(?=\s*(?:\||Rel|Relationship|$))/i,
  /(?:Guarantor|Responsible Party)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z][A-Za-z\s,.-]+?)(?=\s*(?:\||$))/i,
  /Subscriber:\s*([A-Za-z][A-Za-z\s,.-]+?)(?=\s*(?:\||Rel|$))/i
];

/**
 * Extract insurance information from lines of text
 * @param lines Array of text lines
 * @returns Parsed insurance information
 */
export function extractInsuranceInfo(lines: string[]): ParsedInsuranceInfo {
  const insuranceInfo: ParsedInsuranceInfo = {};
  const fullText = lines.join('\n');
  
  // Extract insurer name
  for (const pattern of INSURANCE_PATTERNS.insurerName) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name && name.length > 2 && name.length < 100) {
        insuranceInfo.insurerName = normalizeInsuranceName(name);
        break;
      }
    }
  }
  
  // Extract policy number
  for (const pattern of INSURANCE_PATTERNS.policyNumber) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const policyNum = match[1].trim();
      if (policyNum && policyNum.length >= 3 && policyNum.length <= 50) {
        insuranceInfo.policyNumber = policyNum;
        break;
      }
    }
  }
  
  // Extract group number
  for (const pattern of INSURANCE_PATTERNS.groupNumber) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const groupNum = match[1].trim();
      if (groupNum && groupNum.length >= 2 && groupNum.length <= 50) {
        insuranceInfo.groupNumber = groupNum;
        break;
      }
    }
  }
  
  // Extract authorization number
  for (const pattern of INSURANCE_PATTERNS.authorizationNumber) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const authNum = match[1].trim();
      if (authNum && authNum.length >= 3 && authNum.length <= 50) {
        insuranceInfo.authorizationNumber = authNum;
        break;
      }
    }
  }
  
  // Extract policy holder name
  for (const pattern of POLICY_HOLDER_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      let holderName = match[1].trim();
      // Clean up name format
      holderName = holderName
        .replace(/,\s*/, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (holderName && holderName.length >= 3 && holderName.length <= 100) {
        insuranceInfo.policyHolderName = holderName;
        break;
      }
    }
  }
  
  // Extract relationship
  for (const pattern of RELATIONSHIP_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const rel = match[1].trim().toLowerCase();
      // Normalize common relationships
      const relationshipMap: Record<string, string> = {
        'self': 'Self',
        'patient': 'Self',
        'spouse': 'Spouse',
        'husband': 'Spouse',
        'wife': 'Spouse',
        'child': 'Child',
        'son': 'Child',
        'daughter': 'Child',
        'parent': 'Parent',
        'mother': 'Parent',
        'father': 'Parent',
        'other': 'Other'
      };
      
      const normalized = relationshipMap[rel] || 'Other';
      insuranceInfo.relationship = normalized;
      break;
    }
  }
  
  // Clean up extracted information
  cleanupInsuranceInfo(insuranceInfo);
  
  return insuranceInfo;
}

/**
 * Clean up extracted insurance information
 */
function cleanupInsuranceInfo(info: ParsedInsuranceInfo): void {
  // Clean up insurer name
  if (info.insurerName) {
    // Remove common artifacts
    info.insurerName = info.insurerName
      .replace(/\s*\|.*$/, '') // Remove anything after pipe
      .replace(/\s+ID\s*#?\s*:?\s*$/, '') // Remove trailing ID
      .replace(/\s+Policy.*$/, '') // Remove trailing Policy
      .trim();
    
    // Truncate if too long
    if (info.insurerName.length > 50) {
      info.insurerName = info.insurerName.substring(0, 50).trim();
    }
  }
  
  // Clean up policy number
  if (info.policyNumber) {
    info.policyNumber = info.policyNumber
      .replace(/\s+/g, '')
      .replace(/[^\w-]/g, '')
      .toUpperCase();
  }
  
  // Clean up group number
  if (info.groupNumber) {
    info.groupNumber = info.groupNumber
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .toUpperCase();
  }
  
  // Clean up authorization number
  if (info.authorizationNumber) {
    info.authorizationNumber = info.authorizationNumber
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .toUpperCase();
  }
  
  // Clean up policy holder name
  if (info.policyHolderName) {
    info.policyHolderName = info.policyHolderName
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.-]/g, '')
      .trim();
    
    // Capitalize properly
    info.policyHolderName = info.policyHolderName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Ensure relationship doesn't have extra text
  if (info.relationship && info.relationship.length > 20) {
    // Extract just the first word if it's a valid relationship
    const firstWord = info.relationship.split(/\s+/)[0];
    if (['Self', 'Spouse', 'Child', 'Parent', 'Other'].includes(firstWord)) {
      info.relationship = firstWord;
    } else {
      info.relationship = 'Other';
    }
  }
}

export default extractInsuranceInfo;