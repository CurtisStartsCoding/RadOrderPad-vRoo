"use strict";
/**
 * Response normalizer functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCodeArray = exports.normalizeResponseFields = void 0;
// Import functions
const normalize_response_fields_1 = require("./normalize-response-fields");
Object.defineProperty(exports, "normalizeResponseFields", { enumerable: true, get: function () { return normalize_response_fields_1.normalizeResponseFields; } });
const normalize_code_array_1 = require("./normalize-code-array");
Object.defineProperty(exports, "normalizeCodeArray", { enumerable: true, get: function () { return normalize_code_array_1.normalizeCodeArray; } });
// Default export for backward compatibility
exports.default = {
    normalizeResponseFields: normalize_response_fields_1.normalizeResponseFields,
    normalizeCodeArray: normalize_code_array_1.normalizeCodeArray
};
//# sourceMappingURL=index.js.map