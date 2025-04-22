"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEmrSummary = parseEmrSummary;
const textNormalizer_1 = require("./utils/textNormalizer");
const sectionDetector_1 = require("./utils/sectionDetector");
const patientInfoExtractor_1 = require("./utils/patientInfoExtractor");
const insuranceInfoExtractor_1 = require("./utils/insuranceInfoExtractor");
const logger_1 = __importDefault(require("../../../utils/logger"));
/**
 * Parse EMR summary text to extract patient and insurance information
 * Enhanced version with modular, declarative approach
 * @param text EMR summary text
 * @returns Parsed data
 */
function parseEmrSummary(text) {
    try {
        // Initialize parsed data structure
        const parsedData = {
            patientInfo: {},
            insuranceInfo: {}
        };
        // Step 1: Normalize text
        const normalizedText = (0, textNormalizer_1.normalizeText)(text);
        // Step 2: Split into lines
        const lines = (0, textNormalizer_1.splitIntoLines)(normalizedText);
        // Step 3: Identify sections
        const sections = (0, sectionDetector_1.identifySections)(lines);
        // Step 4: Extract patient information
        const patientSection = sections.get('patient') || sections.get('default') || [];
        parsedData.patientInfo = (0, patientInfoExtractor_1.extractPatientInfo)(patientSection);
        // Step 5: Extract insurance information
        const insuranceSection = sections.get('insurance') || sections.get('default') || [];
        parsedData.insuranceInfo = (0, insuranceInfoExtractor_1.extractInsuranceInfo)(insuranceSection);
        // Log the extracted data for debugging
        logger_1.default.debug('EMR Parser extracted data:', {
            patientInfo: parsedData.patientInfo,
            insuranceInfo: parsedData.insuranceInfo
        });
        return parsedData;
    }
    catch (error) {
        // Log the error but don't throw it - we want to return as much data as we can
        logger_1.default.error('Error in EMR parser:', error instanceof Error ? error.message : String(error));
        return {
            patientInfo: {},
            insuranceInfo: {}
        };
    }
}
exports.default = parseEmrSummary;
//# sourceMappingURL=emr-parser.js.map