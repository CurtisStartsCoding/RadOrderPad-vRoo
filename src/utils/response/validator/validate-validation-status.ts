import { ValidationStatus } from '../../../models';
import { StatusMap } from '../types';

/**
 * Validate that the validation status is a valid enum value
 */
export function validateValidationStatus(status: string): void {
  // Convert to lowercase for case-insensitive comparison
  const normalizedStatus = status.toLowerCase();
  
  // Map of possible status values to enum values
  const statusMap: StatusMap = {
    'appropriate': ValidationStatus.APPROPRIATE,
    'inappropriate': ValidationStatus.INAPPROPRIATE,
    'needs_clarification': ValidationStatus.NEEDS_CLARIFICATION,
    'needs clarification': ValidationStatus.NEEDS_CLARIFICATION,
    'override': ValidationStatus.OVERRIDE
  };
  
  // Check if the status is valid
  if (!statusMap[normalizedStatus]) {
    throw new Error(`Invalid validationStatus: ${status}`);
  }
}