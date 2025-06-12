/**
 * Enhanced utility for extracting patient information from EMR text
 * Handles more phone formats, better address parsing, and HTML entities
 */
import { ParsedPatientInfo } from '../types';

/**
 * Decode HTML entities that might appear in EMR text
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  return decoded;
}

/**
 * Clean and normalize phone numbers
 */
function normalizePhoneNumber(phone: string): string {
  // Remove all non-digits except 'x' or 'ext' for extensions
  let cleaned = phone.replace(/[^\d]/g, '');
  
  // Check if it's a valid 10-digit US phone number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // Remove country code
    cleaned = cleaned.slice(1);
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not a standard format
  return phone.trim();
}

/**
 * Enhanced phone number patterns to handle various formats
 */
const PHONE_PATTERNS = [
  // Standard patterns with labels
  /(?:Phone|Tel|Telephone|Ph|Contact)(?:\s*#|\s*:|\s*=|\s*>)?\s*([(\d][\d\s().+-]+[\d)])/i,
  /(?:Home|Work|Cell|Mobile|Office)(?:\s*Phone)?(?:\s*#|\s*:|\s*=|\s*>)?\s*([(\d][\d\s().+-]+[\d)])/i,
  /(?:Primary|Secondary|Main)(?:\s*Phone)?(?:\s*#|\s*:|\s*=|\s*>)?\s*([(\d][\d\s().+-]+[\d)])/i,
  
  // Patterns with abbreviations
  /(?:Ph|P|H|C|W|M)\s*(?:\(([HCW])\))?\s*[:=]?\s*([(\d][\d\s().+-]+[\d)])/i,
  
  // Inline patterns (e.g., from address lines)
  /\|\s*([(\d][\d\s().+-]+[\d)])\s*(?:\||$)/,
  
  // Standalone phone numbers with common formats
  /\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})\b/,
  /\b\((\d{3})\)\s*(\d{3})[-.\s]?(\d{4})\b/,
  /\b(\d{3})\.(\d{3})\.(\d{4})\b/,
  
  // Special format from the images
  /Contact:\s*[^|]+\|\s*([(\d][\d\s().+-]+[\d)])/i
];

/**
 * Enhanced address patterns
 */
const ADDRESS_PATTERNS = [
  // Standard labeled patterns
  /(?:Address|Addr|Street Address)(?:\s*:|\s*=|\s*>)?\s*([^\n]{5,100}?)(?=\s*(?:City|State|ZIP|Phone|Email|\n|$))/i,
  
  // Multi-line address pattern
  /(?:Address|Addr)(?:\s*:|\s*=|\s*>)?\s*([^\n]+(?:\n\s+[^\n]+)*?)(?=\s*(?:City|State|ZIP|Phone|Email|\n\n|$))/i,
  
  // Contact line pattern (from the athena format)
  /Contact:\s*([^|]+?)\s*(?:\||$)/i,
  
  // Table cell pattern
  /(?:Street|Address)[\s:]*\n?\s*([^\n]+)/i
];

/**
 * Enhanced city/state/zip patterns
 */
const LOCATION_PATTERNS = {
  // Combined city, state, zip
  combined: [
    /([A-Za-z][A-Za-z\s]+?)\s*,\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/,
    /([A-Za-z][A-Za-z\s]+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/,
    // From contact line
    /\|\s*([A-Za-z][A-Za-z\s]+?)\s*,\s*([A-Z]{2})\s+(\d{5})/
  ],
  
  // Individual patterns
  city: [
    /(?:City|Town)(?:\s*:|\s*=|\s*>)?\s*([A-Za-z][A-Za-z\s]+?)(?=\s*(?:,|State|ST|$))/i
  ],
  state: [
    /(?:State|ST|Province)(?:\s*:|\s*=|\s*>)?\s*([A-Z]{2})\b/i,
    /\b([A-Z]{2})\s+\d{5}/ // State before zip
  ],
  zip: [
    /(?:ZIP|Zip Code|Postal Code|Zip)(?:\s*:|\s*=|\s*>)?\s*(\d{5}(?:-\d{4})?)/i,
    /\b(\d{5}(?:-\d{4})?)\b/ // Standalone zip
  ]
};

/**
 * Valid US state codes for validation
 */
const VALID_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

/**
 * Extract patient information from lines of text
 * @param lines Array of text lines
 * @returns Parsed patient information
 */
export function extractPatientInfo(lines: string[]): ParsedPatientInfo {
  const patientInfo: ParsedPatientInfo = {};
  
  // Decode HTML entities first
  const decodedLines = lines.map(line => decodeHtmlEntities(line));
  const fullText = decodedLines.join('\n');
  
  // Extract phone numbers with enhanced patterns
  for (const pattern of PHONE_PATTERNS) {
    const match = fullText.match(pattern);
    if (match) {
      const phoneMatch = match[match.length - 1]; // Get the last capturing group
      if (phoneMatch && phoneMatch.length >= 10) {
        const normalized = normalizePhoneNumber(phoneMatch);
        if (normalized && !patientInfo.phone) {
          patientInfo.phone = normalized;
          break;
        }
      }
    }
  }
  
  // Extract email
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = fullText.match(emailPattern);
  if (emailMatch) {
    patientInfo.email = emailMatch[1].trim();
  }
  
  // Extract address with enhanced patterns
  for (const pattern of ADDRESS_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      let address = match[1].trim();
      // Clean up multi-line addresses
      address = address.replace(/\n\s+/g, ' ').trim();
      // Remove trailing city/state/zip if captured
      address = address.replace(/\s*,?\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s+\d{5}.*$/, '').trim();
      
      if (address && address.length > 5 && address.length < 100) {
        patientInfo.address = address;
        break;
      }
    }
  }
  
  // Try combined city/state/zip patterns first
  let locationFound = false;
  for (const pattern of LOCATION_PATTERNS.combined) {
    const match = fullText.match(pattern);
    if (match) {
      const city = match[1].trim();
      const state = match[2].trim();
      const zip = match[3].trim();
      
      if (VALID_STATES.has(state)) {
        patientInfo.city = city;
        patientInfo.state = state;
        patientInfo.zipCode = zip;
        locationFound = true;
        break;
      }
    }
  }
  
  // If combined pattern didn't work, try individual patterns
  if (!locationFound) {
    // Extract city
    for (const pattern of LOCATION_PATTERNS.city) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        patientInfo.city = match[1].trim();
        break;
      }
    }
    
    // Extract state
    for (const pattern of LOCATION_PATTERNS.state) {
      let match;
      const regex = new RegExp(pattern, 'g');
      while ((match = regex.exec(fullText)) !== null) {
        const state = match[1];
        if (VALID_STATES.has(state)) {
          patientInfo.state = state;
          break;
        }
      }
      if (patientInfo.state) break;
    }
    
    // Extract zip
    for (const pattern of LOCATION_PATTERNS.zip) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        patientInfo.zipCode = match[1];
        break;
      }
    }
  }
  
  // Clean up any remaining issues
  cleanupPatientInfo(patientInfo);
  
  return patientInfo;
}

/**
 * Clean up extracted patient information
 */
function cleanupPatientInfo(info: ParsedPatientInfo): void {
  // Clean up address
  if (info.address) {
    // Remove extra whitespace
    info.address = info.address.replace(/\s+/g, ' ').trim();
    
    // Remove common artifacts
    info.address = info.address
      .replace(/^Address\s*:\s*/i, '')
      .replace(/^Addr\s*:\s*/i, '')
      .replace(/^Street Address\s*:\s*/i, '')
      .trim();
    
    // Truncate if too long
    if (info.address.length > 100) {
      const words = info.address.split(' ');
      info.address = words.slice(0, 10).join(' ');
    }
  }
  
  // Clean up city
  if (info.city) {
    info.city = info.city
      .replace(/^City\s*:\s*/i, '')
      .replace(/^Town\s*:\s*/i, '')
      .replace(/[,\s]+$/, '')
      .trim();
    
    // Fix common issues
    if (info.city.toLowerCase().startsWith('lives in ')) {
      info.city = info.city.substring(9).trim();
    }
    
    // Remove state/zip if accidentally included
    info.city = info.city.replace(/\s+[A-Z]{2}\s+\d{5}.*$/, '').trim();
  }
  
  // Validate state
  if (info.state && !VALID_STATES.has(info.state)) {
    delete info.state;
  }
  
  // Validate zip
  if (info.zipCode && !/^\d{5}(?:-\d{4})?$/.test(info.zipCode)) {
    delete info.zipCode;
  }
}

export default extractPatientInfo;