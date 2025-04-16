"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPagination = exports.applySorting = exports.applyAllFilters = exports.createBaseQuery = void 0;
const base_query_1 = require("./base-query");
Object.defineProperty(exports, "createBaseQuery", { enumerable: true, get: function () { return base_query_1.createBaseQuery; } });
const filter_orchestrator_1 = require("./filter-orchestrator");
Object.defineProperty(exports, "applyAllFilters", { enumerable: true, get: function () { return filter_orchestrator_1.applyAllFilters; } });
const sorting_1 = require("./sorting");
Object.defineProperty(exports, "applySorting", { enumerable: true, get: function () { return sorting_1.applySorting; } });
const pagination_1 = require("./pagination");
Object.defineProperty(exports, "applyPagination", { enumerable: true, get: function () { return pagination_1.applyPagination; } });
/**
 * Build the main query for getting incoming orders
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Object containing the query string and parameters
 */
function buildOrderQuery(orgId, filters = {}) {
    // Create the base query
    let { query, params, paramIndex } = (0, base_query_1.createBaseQuery)(orgId);
    // Apply all filters
    const filterResult = (0, filter_orchestrator_1.applyAllFilters)(query, params, paramIndex, filters);
    query = filterResult.query;
    params = filterResult.params;
    paramIndex = filterResult.paramIndex;
    // Apply sorting
    query = (0, sorting_1.applySorting)(query, filters.sortBy, filters.sortOrder);
    // Apply pagination
    const paginationResult = (0, pagination_1.applyPagination)(query, params, paramIndex, filters.page, filters.limit);
    query = paginationResult.query;
    params = paginationResult.params;
    return { query, params };
}
// Default export for backward compatibility
exports.default = buildOrderQuery;
//# sourceMappingURL=index.js.map