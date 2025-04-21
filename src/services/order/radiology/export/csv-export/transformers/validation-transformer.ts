import { ValidationInfo } from '../interfaces';
import { formatBoolean, formatDate, safeString } from '../utils';

/**
 * Transform validation data for CSV export
 * @param validationAttempts Validation attempts array from database
 * @param order Order data for override information
 * @returns Transformed validation info for CSV
 */
export function transformValidationData(
  validationAttempts: Record<string, unknown>[] | undefined,
  order: Record<string, unknown>
): ValidationInfo {
  if (!validationAttempts) {
    validationAttempts = [];
  }

  const lastValidationAttempt = validationAttempts.length > 0 
    ? validationAttempts[validationAttempts.length - 1] 
    : null;

  return {
    validation_attempts_count: validationAttempts.length,
    last_validation_date: formatDate(lastValidationAttempt?.created_at as string | Date),
    override_status: formatBoolean(order?.overridden as boolean),
    override_reason: safeString(order?.override_justification) || 'N/A'
  };
}