/**
 * Common types shared across services
 */

/**
 * Patient information
 */
export interface PatientInfo {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mrn?: string;
  [key: string]: string | number | boolean | undefined;
}