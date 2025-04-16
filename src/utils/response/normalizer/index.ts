/**
 * Response normalizer functions
 */

// Import functions
import { normalizeResponseFields } from './normalize-response-fields';
import { normalizeCodeArray } from './normalize-code-array';

// Re-export functions
export { normalizeResponseFields };
export { normalizeCodeArray };

// Default export for backward compatibility
export default {
  normalizeResponseFields,
  normalizeCodeArray
};