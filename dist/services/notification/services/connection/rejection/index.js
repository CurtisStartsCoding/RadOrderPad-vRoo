/**
 * Connection rejection notification utilities
 */
// Import functions
import { prepareConnectionRejectionData } from './prepare-connection-rejection-data';
import { sendConnectionRejected } from './send-connection-rejected';
// Re-export functions
export { prepareConnectionRejectionData };
export { sendConnectionRejected };
// Default export for backward compatibility
export default {
    prepareConnectionRejectionData,
    sendConnectionRejected
};
//# sourceMappingURL=index.js.map