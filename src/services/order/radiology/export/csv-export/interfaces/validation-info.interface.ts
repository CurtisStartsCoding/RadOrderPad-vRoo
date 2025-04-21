/**
 * Interface for validation information in CSV export
 */
export interface ValidationInfo {
  validation_attempts_count: number;
  last_validation_date?: string;
  override_status: string;
  override_reason: string;
}