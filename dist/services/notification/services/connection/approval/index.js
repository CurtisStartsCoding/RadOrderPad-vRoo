/**
 * Connection approval notification utilities
 */
// Import functions
import { prepareConnectionApprovalData } from './prepare-connection-approval-data';
import { sendConnectionApproved } from './send-connection-approved';
// Re-export functions
export { prepareConnectionApprovalData };
export { sendConnectionApproved };
// Default export for backward compatibility
export default {
    prepareConnectionApprovalData,
    sendConnectionApproved
};
//# sourceMappingURL=index.js.map