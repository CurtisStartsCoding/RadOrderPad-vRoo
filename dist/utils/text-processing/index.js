"use strict";
/**
 * Text processing utilities
 *
 * This module provides utilities for processing medical text, including:
 * - PHI (Personal Health Information) sanitization
 * - Medical keyword extraction
 * - Medical code extraction
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
exports.isMedicalCode = exports.extractMedicalCodes = exports.extractCPTCodes = exports.extractICD10Codes = exports.extractKeywordsByCategory = exports.extractCategorizedMedicalKeywords = exports.extractMedicalKeywords = exports.stripPHI = void 0;
exports.processMedicalText = processMedicalText;
// Import functions needed for the processMedicalText function
const phi_sanitizer_1 = require("./phi-sanitizer");
const keyword_extractor_1 = require("./keyword-extractor");
const code_extractor_1 = require("./code-extractor");
// Export types
__exportStar(require("./types"), exports);
// Export medical terms
__exportStar(require("./medical-terms"), exports);
// Export PHI sanitization utilities
var phi_sanitizer_2 = require("./phi-sanitizer");
Object.defineProperty(exports, "stripPHI", { enumerable: true, get: function () { return phi_sanitizer_2.stripPHI; } });
// Export keyword extraction utilities
var keyword_extractor_2 = require("./keyword-extractor");
Object.defineProperty(exports, "extractMedicalKeywords", { enumerable: true, get: function () { return keyword_extractor_2.extractMedicalKeywords; } });
Object.defineProperty(exports, "extractCategorizedMedicalKeywords", { enumerable: true, get: function () { return keyword_extractor_2.extractCategorizedMedicalKeywords; } });
Object.defineProperty(exports, "extractKeywordsByCategory", { enumerable: true, get: function () { return keyword_extractor_2.extractKeywordsByCategory; } });
// Export code extraction utilities
var code_extractor_2 = require("./code-extractor");
Object.defineProperty(exports, "extractICD10Codes", { enumerable: true, get: function () { return code_extractor_2.extractICD10Codes; } });
Object.defineProperty(exports, "extractCPTCodes", { enumerable: true, get: function () { return code_extractor_2.extractCPTCodes; } });
Object.defineProperty(exports, "extractMedicalCodes", { enumerable: true, get: function () { return code_extractor_2.extractMedicalCodes; } });
Object.defineProperty(exports, "isMedicalCode", { enumerable: true, get: function () { return code_extractor_2.isMedicalCode; } });
/**
 * Main text processing functions
 */
/**
 * Process medical text by sanitizing PHI and extracting keywords
 *
 * @param text - The text to process
 * @returns Object containing sanitized text and extracted keywords
 */
function processMedicalText(text) {
    // First sanitize PHI
    const sanitizedText = (0, phi_sanitizer_1.stripPHI)(text);
    // Then extract keywords from the sanitized text
    const keywords = (0, keyword_extractor_1.extractMedicalKeywords)(sanitizedText);
    // Extract categorized keywords
    const categorizedKeywords = (0, keyword_extractor_1.extractCategorizedMedicalKeywords)(sanitizedText);
    // Extract medical codes
    const medicalCodes = (0, code_extractor_1.extractMedicalCodes)(sanitizedText);
    return {
        originalText: text,
        sanitizedText,
        keywords,
        categorizedKeywords,
        medicalCodes
    };
}
//# sourceMappingURL=index.js.map