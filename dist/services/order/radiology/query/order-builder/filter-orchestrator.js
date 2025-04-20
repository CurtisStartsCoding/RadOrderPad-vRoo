"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAllFilters = applyAllFilters;
const status_filter_1 = require("./status-filter");
const organization_filter_1 = require("./organization-filter");
const metadata_filters_1 = require("./metadata-filters");
const date_filters_1 = require("./date-filters");
const validation_filter_1 = require("./validation-filter");
/**
 * Apply all filters to the query
 * @param query Current query string
 * @param params Current query parameters
 * @param paramIndex Current parameter index
 * @param filters Filter parameters
 * @returns Updated query, params, and paramIndex
 */
function applyAllFilters(query, params, paramIndex, filters = {}) {
    let result = { query, params, paramIndex };
    // Apply each filter in sequence
    result = (0, status_filter_1.applyStatusFilter)(result.query, result.params, result.paramIndex, filters.status);
    result = (0, organization_filter_1.applyReferringOrgFilter)(result.query, result.params, result.paramIndex, filters.referringOrgId);
    result = (0, metadata_filters_1.applyPriorityFilter)(result.query, result.params, result.paramIndex, filters.priority);
    result = (0, metadata_filters_1.applyModalityFilter)(result.query, result.params, result.paramIndex, filters.modality);
    result = (0, date_filters_1.applyDateRangeFilter)(result.query, result.params, result.paramIndex, filters.startDate, filters.endDate);
    result = (0, validation_filter_1.applyValidationStatusFilter)(result.query, result.params, result.paramIndex, filters.validationStatus);
    return result;
}
//# sourceMappingURL=filter-orchestrator.js.map