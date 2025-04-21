"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCsvExport = generateCsvExport;
const Papa = __importStar(require("papaparse"));
const logger_1 = __importDefault(require("../../../../../utils/logger"));
const utils_1 = require("./utils");
const transformers_1 = require("./transformers");
/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @param options CSV export options
 * @returns CSV string
 */
function generateCsvExport(orderDetails, options = {}) {
    try {
        // Extract data from order details
        const { order, patient, insurance, clinicalRecords, documentUploads, validationAttempts, orderHistory } = orderDetails;
        // Apply default options
        const exportOptions = {
            includeHeaders: options.includeHeaders ?? true,
            delimiter: options.delimiter ?? ',',
            quoteFields: options.quoteFields ?? true
        };
        // Transform data using specialized transformers
        const orderInfo = (0, transformers_1.transformOrderData)(order);
        const patientInfo = (0, transformers_1.transformPatientData)(patient);
        const insuranceInfo = (0, transformers_1.transformInsuranceData)(insurance, order);
        const referringInfo = (0, transformers_1.transformReferringData)(order);
        const radiologyInfo = (0, transformers_1.transformRadiologyData)(order);
        const clinicalRecordsInfo = (0, transformers_1.transformClinicalRecordsData)(clinicalRecords, documentUploads, order);
        const validationInfo = (0, transformers_1.transformValidationData)(validationAttempts, order);
        // Add history timestamps
        const historyInfo = {
            sent_to_radiology_at: (0, utils_1.getHistoryTimestamp)(orderHistory, 'sent_to_radiology'),
            scheduled_at: (0, utils_1.getHistoryTimestamp)(orderHistory, 'scheduled'),
            completed_at: (0, utils_1.getHistoryTimestamp)(orderHistory, 'completed')
        };
        // Combine all data into a single flattened object
        const flatData = {
            ...orderInfo,
            ...patientInfo,
            ...insuranceInfo,
            ...referringInfo,
            ...radiologyInfo,
            ...clinicalRecordsInfo,
            ...validationInfo,
            ...historyInfo
        };
        // Use PapaParse to generate CSV
        const csvString = Papa.unparse([flatData], {
            header: exportOptions.includeHeaders,
            delimiter: exportOptions.delimiter,
            newline: '\n',
            skipEmptyLines: true,
            quotes: exportOptions.quoteFields
        });
        return csvString;
    }
    catch (error) {
        logger_1.default.error('Error generating CSV export:', error instanceof Error ? error.message : String(error));
        throw new Error('Failed to generate CSV export');
    }
}
exports.default = generateCsvExport;
//# sourceMappingURL=generate-csv-export.js.map