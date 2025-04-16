/**
 * Re-export all admin-related types
 */

// EMR types
export {
  ParsedPatientInfo,
  ParsedInsuranceInfo,
  ParsedEmrData,
  EmrSummaryResult,
  SupplementalDocResult
} from './emr-types';

// Patient types
export {
  PatientUpdateData,
  PatientData,
  PatientUpdateResult
} from './patient-types';

// Insurance types
export {
  InsuranceUpdateData,
  InsuranceData,
  InsuranceUpdateResult
} from './insurance-types';

// Order types
export {
  OrderData,
  SendToRadiologyResult
} from './order-types';