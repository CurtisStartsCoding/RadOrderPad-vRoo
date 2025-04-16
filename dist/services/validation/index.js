"use strict";
/**
 * Validation service module
 *
 * This module provides functionality for validating medical orders
 * using LLM-based validation.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = exports.logLLMUsage = exports.logValidationAttempt = exports.runValidation = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export validation functions
var run_validation_1 = require("./run-validation");
Object.defineProperty(exports, "runValidation", { enumerable: true, get: function () { return run_validation_1.runValidation; } });
var logging_1 = require("./logging");
Object.defineProperty(exports, "logValidationAttempt", { enumerable: true, get: function () { return logging_1.logValidationAttempt; } });
var llm_logging_1 = require("./llm-logging");
Object.defineProperty(exports, "logLLMUsage", { enumerable: true, get: function () { return llm_logging_1.logLLMUsage; } });
const run_validation_2 = require("./run-validation");
/**
 * Service for handling validation-related operations
 */
class ValidationService {
    /**
     * Run validation on the provided text and context
     */
    static async runValidation(text, context = {}, testMode = false) {
        return (0, run_validation_2.runValidation)(text, context, { testMode });
    }
}
exports.ValidationService = ValidationService;
// Export ValidationService as default for backward compatibility
exports.default = ValidationService;
//# sourceMappingURL=index.js.map