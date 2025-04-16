/**
 * Clinical record manager services
 */
import { saveEmrSummary } from './save-emr-summary';
import { saveSupplementalDocument } from './save-supplemental-document';
import { verifyOrderStatus } from './verify-order-status';
export { saveEmrSummary };
export { saveSupplementalDocument };
export { verifyOrderStatus };
declare const _default: {
    saveEmrSummary: typeof saveEmrSummary;
    saveSupplementalDocument: typeof saveSupplementalDocument;
    verifyOrderStatus: typeof verifyOrderStatus;
};
export default _default;
