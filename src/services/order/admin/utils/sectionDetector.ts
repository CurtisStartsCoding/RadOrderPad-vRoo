/**
 * Utility for detecting sections in EMR text
 */

/**
 * Section patterns for different EMR formats
 */
export const SECTION_PATTERNS = {
  patient: /(?:PATIENT|PATIENT INFO|PATIENT INFORMATION|DEMOGRAPHICS)(?:\s*:|\s*\n|\s*$)/i,
  insurance: /(?:INSURANCE|COVERAGE|GUARANTOR|PAYER|PRIMARY INSURANCE|INSURANCE INFO)(?:\s*:|\s*\n|\s*$)/i,
  provider: /(?:PROVIDER|PROVIDER INFO|REFERRING PROVIDER|ORDERING PROVIDER)(?:\s*:|\s*\n|\s*$)/i,
  encounter: /(?:ENCOUNTER|VISIT|APPOINTMENT|ENCOUNTER DATE)(?:\s*:|\s*\n|\s*$)/i,
  emergency: /(?:EMERGENCY CONTACTS|EMERGENCY|EMERGENCY INFO)(?:\s*:|\s*\n|\s*$)/i
};

/**
 * Identify sections in the EMR text
 * @param lines Array of text lines
 * @returns Map of section names to their content
 */
export function identifySections(lines: string[]): Map<string, string[]> {
  const sections = new Map<string, string[]>();
  
  // Initialize with default section
  let currentSection = 'default';
  let sectionLines: string[] = [];
  
  // Process each line
  for (const line of lines) {
    let foundNewSection = false;
    
    // Check if this line starts a new section
    for (const [sectionName, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        // Save the previous section
        if (sectionLines.length > 0) {
          sections.set(currentSection, sectionLines);
        }
        
        // Start a new section
        currentSection = sectionName;
        sectionLines = [];
        foundNewSection = true;
        break;
      }
    }
    
    if (!foundNewSection) {
      sectionLines.push(line);
    }
  }
  
  // Save the last section
  if (sectionLines.length > 0) {
    sections.set(currentSection, sectionLines);
  }
  
  // If no sections were found, use the entire text as default
  if (sections.size === 0) {
    sections.set('default', lines);
  }
  
  return sections;
}