/**
 * Order status management utilities
 */
// Import functions
import { updateOrderStatusToRadiology } from './update-order-status';
import { validatePatientData } from './validate-patient-data';
import { validateInsuranceData } from './validate-insurance-data';
// Re-export functions
export { updateOrderStatusToRadiology };
export { validatePatientData };
export { validateInsuranceData };
// Default export for backward compatibility
export default {
    updateOrderStatusToRadiology,
    validatePatientData,
    validateInsuranceData
};
//# sourceMappingURL=index.js.map