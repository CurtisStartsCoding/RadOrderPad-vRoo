/**
 * Utility for building SQL update queries
 */
import { buildUpdateQuery } from './build-update-query';
import { buildUpdateQueryFromPairs } from './build-update-query-from-pairs';
// Re-export functions
export { buildUpdateQuery };
export { buildUpdateQueryFromPairs };
// Default export for backward compatibility
export default {
    buildUpdateQuery,
    buildUpdateQueryFromPairs
};
//# sourceMappingURL=index.js.map