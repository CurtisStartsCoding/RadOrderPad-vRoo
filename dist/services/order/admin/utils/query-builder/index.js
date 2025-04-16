"use strict";
/**
 * Utility for building SQL update queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdateQueryFromPairs = exports.buildUpdateQuery = void 0;
const build_update_query_1 = require("./build-update-query");
Object.defineProperty(exports, "buildUpdateQuery", { enumerable: true, get: function () { return build_update_query_1.buildUpdateQuery; } });
const build_update_query_from_pairs_1 = require("./build-update-query-from-pairs");
Object.defineProperty(exports, "buildUpdateQueryFromPairs", { enumerable: true, get: function () { return build_update_query_from_pairs_1.buildUpdateQueryFromPairs; } });
// Default export for backward compatibility
exports.default = {
    buildUpdateQuery: build_update_query_1.buildUpdateQuery,
    buildUpdateQueryFromPairs: build_update_query_from_pairs_1.buildUpdateQueryFromPairs
};
//# sourceMappingURL=index.js.map