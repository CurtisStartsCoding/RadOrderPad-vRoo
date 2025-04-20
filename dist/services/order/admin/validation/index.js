/**
 * Validation utilities for admin order service
 */
// Import functions
import { getPatientForValidation, validatePatientFields } from './patient';
import { getPrimaryInsurance, validateInsuranceFields } from './insurance';
// Re-export functions
export { getPatientForValidation, validatePatientFields };
export { getPrimaryInsurance, validateInsuranceFields };
// Default export for backward compatibility
export default {
    getPatientForValidation,
    getPrimaryInsurance,
    validatePatientFields,
    validateInsuranceFields
};
//# sourceMappingURL=index.js.map