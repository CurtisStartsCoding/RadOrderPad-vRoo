/**
 * Patient Search Service
 * 
 * This service handles searching for existing patients within an organization
 * based on patient name and date of birth from physician dictation.
 */

import { getPhiDbClient } from '../config/db';
import enhancedLogger from '../utils/enhanced-logger';

export interface PatientSearchResult {
  id: number;
  pidn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mrn?: string;
  lastVisit?: string;
}

export interface PatientSearchParams {
  patientName: string;    // Full patient name from dictation
  dateOfBirth: string;    // Date of birth from dictation (natural language or YYYY-MM-DD)
}

class PatientSearchService {
  /**
   * Search for patients within an organization by name and date of birth
   * 
   * @param organizationId The organization ID to search within
   * @param searchParams Search parameters containing patient name and DOB
   * @returns Array of matching patients
   */
  async searchPatients(
    organizationId: number,
    searchParams: PatientSearchParams
  ): Promise<PatientSearchResult[]> {
    const client = await getPhiDbClient();
    
    try {
      const { patientName, dateOfBirth } = searchParams;
      
      // Parse the patient name to handle various formats
      const nameParts = this.parsePatientName(patientName);
      
      // Parse the date of birth from natural language
      const parsedDate = this.parseDateFromDictation(dateOfBirth);
      if (!parsedDate) {
        enhancedLogger.warn('Could not parse date from dictation:', dateOfBirth);
        return []; // Return empty if date can't be parsed
      }
      
      // Build query conditions
      const conditions: string[] = ['p.organization_id = $1'];
      const values: (string | number)[] = [organizationId];
      let paramIndex = 2;
      
      // Search by date of birth (required)
      conditions.push(`p.date_of_birth = $${paramIndex}`);
      values.push(parsedDate);
      paramIndex++;
      
      // Search by name - handle different name formats
      if (nameParts.firstName && nameParts.lastName) {
        // Both first and last name provided
        conditions.push(`(
          (LOWER(p.first_name) = $${paramIndex} AND LOWER(p.last_name) = $${paramIndex + 1}) OR
          (LOWER(p.first_name) LIKE $${paramIndex + 2} AND LOWER(p.last_name) LIKE $${paramIndex + 3})
        )`);
        values.push(
          nameParts.firstName.toLowerCase(),
          nameParts.lastName.toLowerCase(),
          `%${nameParts.firstName.toLowerCase()}%`,
          `%${nameParts.lastName.toLowerCase()}%`
        );
        paramIndex += 4;
      } else if (nameParts.fullName) {
        // Single name or unparseable format - search in full name
        const searchTerm = `%${nameParts.fullName.toLowerCase()}%`;
        conditions.push(`(
          LOWER(p.first_name) LIKE $${paramIndex} OR 
          LOWER(p.last_name) LIKE $${paramIndex} OR 
          LOWER(CONCAT(p.first_name, ' ', p.last_name)) LIKE $${paramIndex}
        )`);
        values.push(searchTerm);
        paramIndex++;
      }
      
      // Build and execute the query
      const query = `
        SELECT 
          p.id,
          p.pidn,
          p.first_name as "firstName",
          p.last_name as "lastName",
          p.date_of_birth::text as "dateOfBirth",
          p.gender,
          p.mrn,
          MAX(o.created_at)::text as "lastVisit"
        FROM patients p
        LEFT JOIN orders o ON p.id = o.patient_id
        WHERE ${conditions.join(' AND ')}
        GROUP BY p.id, p.pidn, p.first_name, p.last_name, p.date_of_birth, p.gender, p.mrn
        ORDER BY 
          CASE WHEN MAX(o.created_at) IS NOT NULL THEN 0 ELSE 1 END,
          MAX(o.created_at) DESC NULLS LAST,
          p.last_name,
          p.first_name
        LIMIT 10
      `;
      
      const result = await client.query(query, values);
      
      return result.rows;
    } catch (error) {
      enhancedLogger.error('Error searching patients:', error);
      throw new Error('Failed to search patients');
    } finally {
      client.release();
    }
  }
  
  /**
   * Parse patient name from dictation into first and last name
   * Handles various formats: "John Doe", "Doe, John", etc.
   */
  private parsePatientName(patientName: string): { firstName?: string; lastName?: string; fullName: string } {
    const trimmed = patientName.trim();
    
    if (!trimmed) {
      return { fullName: '' };
    }
    
    // Handle "Last, First" format
    if (trimmed.includes(',')) {
      const parts = trimmed.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        return {
          firstName: parts[1],
          lastName: parts[0],
          fullName: trimmed
        };
      }
    }
    
    // Handle "First Last" format
    const parts = trimmed.split(/\s+/);
    if (parts.length === 2) {
      return {
        firstName: parts[0],
        lastName: parts[1],
        fullName: trimmed
      };
    } else if (parts.length > 2) {
      // Handle "First Middle Last" - assume last word is last name
      return {
        firstName: parts[0],
        lastName: parts[parts.length - 1],
        fullName: trimmed
      };
    }
    
    // Single name or unparseable
    return { fullName: trimmed };
  }
  
  /**
   * Parse date from natural language dictation to YYYY-MM-DD format
   * Handles formats like:
   * - "March 1st 1980", "March 1 1980", "March first nineteen eighty"
   * - "3/1/1980", "03/01/1980", "3-1-1980"
   * - "1980-03-01" (already formatted)
   * - "March 1st 80" (assumes 1900s for 80-99, 2000s for 00-79)
   */
  private parseDateFromDictation(dateString: string): string | null {
    const trimmed = dateString.trim();
    
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    
    // Month name mappings
    const months: { [key: string]: string } = {
      'january': '01', 'jan': '01',
      'february': '02', 'feb': '02',
      'march': '03', 'mar': '03',
      'april': '04', 'apr': '04',
      'may': '05',
      'june': '06', 'jun': '06',
      'july': '07', 'jul': '07',
      'august': '08', 'aug': '08',
      'september': '09', 'sep': '09', 'sept': '09',
      'october': '10', 'oct': '10',
      'november': '11', 'nov': '11',
      'december': '12', 'dec': '12'
    };
    
    // Number word mappings
    const numberWords: { [key: string]: string } = {
      'first': '1', 'second': '2', 'third': '3', 'fourth': '4', 'fifth': '5',
      'sixth': '6', 'seventh': '7', 'eighth': '8', 'ninth': '9', 'tenth': '10',
      'eleventh': '11', 'twelfth': '12', 'thirteenth': '13', 'fourteenth': '14',
      'fifteenth': '15', 'sixteenth': '16', 'seventeenth': '17', 'eighteenth': '18',
      'nineteenth': '19', 'twentieth': '20', 'twenty-first': '21', 'twenty-second': '22',
      'twenty-third': '23', 'twenty-fourth': '24', 'twenty-fifth': '25',
      'twenty-sixth': '26', 'twenty-seventh': '27', 'twenty-eighth': '28',
      'twenty-ninth': '29', 'thirtieth': '30', 'thirty-first': '31'
    };
    
    // Clean up common suffixes and normalize
    const cleaned = trimmed.toLowerCase()
      .replace(/(\d+)(st|nd|rd|th)/g, '$1') // Remove ordinal suffixes
      .replace(/[,]/g, '') // Remove commas
      .replace(/\s+/g, ' '); // Normalize spaces
    
    // Try to parse MM/DD/YYYY or MM-DD-YYYY
    const slashDashPattern = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/;
    const slashDashMatch = cleaned.match(slashDashPattern);
    if (slashDashMatch) {
      const month = slashDashMatch[1].padStart(2, '0');
      const day = slashDashMatch[2].padStart(2, '0');
      let year = slashDashMatch[3];
      
      // Handle 2-digit years
      if (year.length === 2) {
        year = parseInt(year) >= 80 ? '19' + year : '20' + year;
      }
      
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse natural language format: "March 1 1980" or "March first nineteen eighty"
    const parts = cleaned.split(' ');
    if (parts.length >= 3) {
      let month = null;
      let day = null;
      let year = null;
      
      // Find month
      for (const part of parts) {
        if (months[part]) {
          month = months[part];
          break;
        }
      }
      
      if (month) {
        // Find day (could be number or word)
        for (const part of parts) {
          // Check if it's a number
          if (/^\d{1,2}$/.test(part)) {
            day = part.padStart(2, '0');
            break;
          }
          // Check if it's a number word
          if (numberWords[part]) {
            day = numberWords[part].padStart(2, '0');
            break;
          }
        }
        
        // Find year
        for (const part of parts) {
          // 4-digit year
          if (/^\d{4}$/.test(part)) {
            year = part;
            break;
          }
          // 2-digit year
          if (/^\d{2}$/.test(part) && part !== day) {
            const yearNum = parseInt(part);
            year = yearNum >= 80 ? '19' + part : '20' + part;
            break;
          }
          // Written out year like "nineteen eighty"
          if (part === 'nineteen' || part === 'twenty') {
            const yearBase = part === 'nineteen' ? '19' : '20';
            const nextIndex = parts.indexOf(part) + 1;
            if (nextIndex < parts.length) {
              const yearEnd = parts[nextIndex];
              if (/^\d{2}$/.test(yearEnd)) {
                year = yearBase + yearEnd;
                break;
              }
              // Handle written numbers for year
              const writtenNumbers: { [key: string]: string } = {
                'eighty': '80', 'eighty-one': '81', 'eighty-two': '82',
                'eighty-three': '83', 'eighty-four': '84', 'eighty-five': '85',
                'eighty-six': '86', 'eighty-seven': '87', 'eighty-eight': '88',
                'eighty-nine': '89', 'ninety': '90', 'ninety-one': '91',
                'ninety-two': '92', 'ninety-three': '93', 'ninety-four': '94',
                'ninety-five': '95', 'ninety-six': '96', 'ninety-seven': '97',
                'ninety-eight': '98', 'ninety-nine': '99'
              };
              if (writtenNumbers[yearEnd]) {
                year = yearBase + writtenNumbers[yearEnd];
                break;
              }
            }
          }
        }
        
        if (month && day && year) {
          return `${year}-${month}-${day}`;
        }
      }
    }
    
    // If we couldn't parse it, return null
    return null;
  }
}

export default new PatientSearchService();