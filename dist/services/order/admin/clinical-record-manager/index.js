/**
 * Clinical record manager services
 */
// Import functions
import { saveEmrSummary } from './save-emr-summary';
import { saveSupplementalDocument } from './save-supplemental-document';
import { verifyOrderStatus } from './verify-order-status';
// Re-export functions
export { saveEmrSummary };
export { saveSupplementalDocument };
export { verifyOrderStatus };
// Default export for backward compatibility
export default {
    saveEmrSummary,
    saveSupplementalDocument,
    verifyOrderStatus
};
//# sourceMappingURL=index.js.map