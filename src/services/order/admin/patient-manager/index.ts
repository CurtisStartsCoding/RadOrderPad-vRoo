/**
 * Patient manager functions
 */

// Import functions
import { updatePatientInfo } from './update-patient-info';
import { updatePatientFromEmr } from './update-patient-from-emr';

// Re-export functions
export { updatePatientInfo };
export { updatePatientFromEmr };

// Default export for backward compatibility
export default {
  updatePatientInfo,
  updatePatientFromEmr
};