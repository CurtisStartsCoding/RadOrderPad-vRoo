import { applyStatusFilter } from './status-filter';
import { applyReferringOrgFilter } from './organization-filter';
import { applyPriorityFilter, applyModalityFilter } from './metadata-filters';
import { applyDateRangeFilter } from './date-filters';
import { applyValidationStatusFilter } from './validation-filter';
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
    result = applyStatusFilter(result.query, result.params, result.paramIndex, filters.status);
    result = applyReferringOrgFilter(result.query, result.params, result.paramIndex, filters.referringOrgId);
    result = applyPriorityFilter(result.query, result.params, result.paramIndex, filters.priority);
    result = applyModalityFilter(result.query, result.params, result.paramIndex, filters.modality);
    result = applyDateRangeFilter(result.query, result.params, result.paramIndex, filters.startDate, filters.endDate);
    result = applyValidationStatusFilter(result.query, result.params, result.paramIndex, filters.validationStatus);
    return result;
}
export { applyAllFilters };
//# sourceMappingURL=filter-orchestrator.js.map