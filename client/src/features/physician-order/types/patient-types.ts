/**
 * Patient interface representing a patient in the system
 */
export interface Patient {
  /** Unique identifier for the patient */
  id: number;
  
  /** Patient's full name */
  name: string;
  
  /** Patient's date of birth in string format */
  dob: string;
  
  /** Medical Record Number (optional) */
  mrn?: string;
  
  /** Patient Identification Number (optional) */
  pidn?: string;
  
  /** Patient's age in years (optional) */
  age?: number;
  
  /** Patient's gender (optional) */
  gender?: string;
}
