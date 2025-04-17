import { Patient } from "../types/patient-types";
import { 
  CARD_BG_TEMPORARY, 
  CARD_BG_NORMAL, 
  BUTTON_CLASS_TEMPORARY, 
  BUTTON_CLASS_NORMAL 
} from "../constants";

/**
 * Determines if a patient is temporary based on ID and existence
 * @param patient The patient object to check
 * @returns True if the patient is temporary or missing
 */
export const isTemporaryPatient = (patient: Patient | null | undefined): boolean => {
  return !patient || patient.id === 0;
};

/**
 * Checks if the patient has real information (not default values)
 * @param patient The patient object to check
 * @returns True if the patient has real name and DOB
 */
export const hasRealPatientInfo = (patient: Patient | null | undefined): boolean => {
  if (!patient) return false;
  return patient.name !== "Unknown Patient" && patient.dob !== "Unknown";
};

/**
 * Gets the appropriate background class based on patient status
 * @param isTemporary Whether the patient is temporary
 * @returns CSS class string for the card background
 */
export const getPatientCardBgClass = (isTemporary: boolean): string => {
  return isTemporary ? CARD_BG_TEMPORARY : CARD_BG_NORMAL;
};

/**
 * Gets the appropriate button class based on patient status
 * @param isTemporary Whether the patient is temporary
 * @returns CSS class string for the action button
 */
export const getPatientActionButtonClass = (isTemporary: boolean): string => {
  return isTemporary ? BUTTON_CLASS_TEMPORARY : BUTTON_CLASS_NORMAL;
};

/**
 * Gets the appropriate button title based on patient status
 * @param isTemporary Whether the patient is temporary
 * @param hasRealInfo Whether the patient has real information
 * @returns Title string for the action button
 */
export const getPatientActionButtonTitle = (isTemporary: boolean, hasRealInfo: boolean): string => {
  if (isTemporary) {
    return hasRealInfo ? "Edit Patient Info" : "Add Patient Info";
  }
  return "Edit Patient Info";
};