/**
 * Utility functions for working with order history data
 */
import { OrderHistoryEntry } from '../../../details/types';

/**
 * Extract a timestamp from order history for a specific status
 * @param history Order history array
 * @param statusToFind Status to find in history
 * @returns Timestamp string or empty string
 */
export function getHistoryTimestamp(
  history: OrderHistoryEntry[] | undefined,
  statusToFind: string
): string {
  if (!history || !Array.isArray(history)) return '';
  
  const entry = history.find(h => h.new_status === statusToFind);
  return entry?.created_at ? entry.created_at.toString() : '';
}