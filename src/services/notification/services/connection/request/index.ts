/**
 * Connection request notification services
 */

// Import functions
import { getFrontendUrl } from './get-frontend-url';
import { prepareConnectionRequestData } from './prepare-connection-request-data';
import { sendConnectionRequest } from './send-connection-request';

// Re-export functions
export { getFrontendUrl };
export { prepareConnectionRequestData };
export { sendConnectionRequest };

// Default export for backward compatibility
export default {
  getFrontendUrl,
  prepareConnectionRequestData,
  sendConnectionRequest
};