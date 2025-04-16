/**
 * Utility for building SQL update queries
 */
import { UpdateQueryResult } from './types';
import { buildUpdateQuery } from './build-update-query';
import { buildUpdateQueryFromPairs } from './build-update-query-from-pairs';
export { UpdateQueryResult };
export { buildUpdateQuery };
export { buildUpdateQueryFromPairs };
declare const _default: {
    buildUpdateQuery: typeof buildUpdateQuery;
    buildUpdateQueryFromPairs: typeof buildUpdateQueryFromPairs;
};
export default _default;
