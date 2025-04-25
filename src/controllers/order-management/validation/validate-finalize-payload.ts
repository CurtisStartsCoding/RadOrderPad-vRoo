import { Request, Response } from 'express';
import { ValidationStatus } from '../../../models';

/**
 * Validates the finalize order payload
 * @param req Express request object
 * @param res Express response object
 * @returns true if valid, false if invalid (response is sent in case of invalid)
 */
export function validateFinalizePayload(req: Request, res: Response): boolean {
  const rawPayload = req.body;
  
  // Check for required fields in both camelCase and snake_case formats
  const finalValidationStatus = rawPayload.finalValidationStatus || rawPayload.final_validation_status;
  const finalCPTCode = rawPayload.finalCPTCode || rawPayload.final_cpt_code;
  const clinicalIndication = rawPayload.clinicalIndication || rawPayload.clinical_indication ||
                            rawPayload.dictationText || rawPayload.dictation_text;
  
  // Validate required fields
  if (!finalValidationStatus || !finalCPTCode || !clinicalIndication) {
    res.status(400).json({
      message: 'Required fields missing: finalValidationStatus/final_validation_status, finalCPTCode/final_cpt_code, clinicalIndication/clinical_indication'
    });
    return false;
  }
  
  // Validate that finalValidationStatus is a valid enum value
  if (!Object.values(ValidationStatus).includes(finalValidationStatus)) {
    res.status(400).json({
      message: 'Invalid finalValidationStatus/final_validation_status value'
    });
    return false;
  }
  
  // If this is an override, ensure justification is provided
  const overridden = rawPayload.overridden || rawPayload.overridden === true;
  const overrideJustification = rawPayload.overrideJustification || rawPayload.override_justification;
  
  if (overridden && !overrideJustification) {
    res.status(400).json({
      message: 'Override justification is required when overridden is true'
    });
    return false;
  }
  
  // If this is a temporary patient, ensure patient info is provided
  const isTemporaryPatient = rawPayload.isTemporaryPatient || rawPayload.patient_name_update;
  const patientInfo = rawPayload.patientInfo;
  
  // Check if using legacy format
  const hasLegacyPatientInfo = rawPayload.patient_name_update &&
                              rawPayload.patient_dob_update &&
                              rawPayload.patient_gender_update;
  
  if (isTemporaryPatient && !hasLegacyPatientInfo &&
      (!patientInfo ||
       !patientInfo.firstName ||
       !patientInfo.lastName ||
       !patientInfo.dateOfBirth ||
       !patientInfo.gender)) {
    res.status(400).json({
      message: 'Patient information is required for temporary patients'
    });
    return false;
  }
  
  return true;
}