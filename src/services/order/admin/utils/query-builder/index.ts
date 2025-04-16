/**
 * Utility for building SQL update queries
 */

// Import functions
import { UpdateQueryResult } from './types';
import { buildUpdateQuery } from './build-update-query';
import { buildUpdateQueryFromPairs } from './build-update-query-from-pairs';

// Re-export types
export { UpdateQueryResult };

// Re-export functions
export { buildUpdateQuery };
export { buildUpdateQueryFromPairs };

// Default export for backward compatibility
export default {
  buildUpdateQuery,
  buildUpdateQueryFromPairs
};