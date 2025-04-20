"use strict";
/**
 * Metadata filters for order queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyModalityFilter = exports.applyPriorityFilter = void 0;
// Import functions
const apply_priority_filter_1 = require("./apply-priority-filter");
Object.defineProperty(exports, "applyPriorityFilter", { enumerable: true, get: function () { return apply_priority_filter_1.applyPriorityFilter; } });
const apply_modality_filter_1 = require("./apply-modality-filter");
Object.defineProperty(exports, "applyModalityFilter", { enumerable: true, get: function () { return apply_modality_filter_1.applyModalityFilter; } });
// Default export for backward compatibility
exports.default = {
    applyPriorityFilter: apply_priority_filter_1.applyPriorityFilter,
    applyModalityFilter: apply_modality_filter_1.applyModalityFilter
};
//# sourceMappingURL=index.js.map