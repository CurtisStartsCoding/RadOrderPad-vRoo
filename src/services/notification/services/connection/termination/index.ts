/**
 * Connection termination notification utilities
 */

// Import functions
import { prepareConnectionTerminationData } from './prepare-connection-termination-data';
import { sendConnectionTerminated } from './send-connection-terminated';

// Re-export functions
export { prepareConnectionTerminationData };
export { sendConnectionTerminated };

// Default export for backward compatibility
export default {
  prepareConnectionTerminationData,
  sendConnectionTerminated
};