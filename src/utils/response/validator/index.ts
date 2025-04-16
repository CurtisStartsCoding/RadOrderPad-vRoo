/**
 * Response validation utilities
 */

// Import functions
import { validateRequiredFields } from './validate-required-fields';
import { validateValidationStatus } from './validate-validation-status';

// Re-export functions
export { validateRequiredFields };
export { validateValidationStatus };

// Default export for backward compatibility
export default {
  validateRequiredFields,
  validateValidationStatus
};