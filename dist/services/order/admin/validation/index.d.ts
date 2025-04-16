/**
 * Validation utilities for admin order service
 */
import { getPatientForValidation, validatePatientFields } from './patient';
import { getPrimaryInsurance, validateInsuranceFields } from './insurance';
export { getPatientForValidation, validatePatientFields };
export { getPrimaryInsurance, validateInsuranceFields };
declare const _default: {
    getPatientForValidation: typeof getPatientForValidation;
    getPrimaryInsurance: typeof getPrimaryInsurance;
    validatePatientFields: typeof validatePatientFields;
    validateInsuranceFields: typeof validateInsuranceFields;
};
export default _default;
