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
/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @returns CSV string
 */
function generateCsvExport(orderDetails) {
    try {
        // Extract data from order details
        const { order, patient, insurance, clinicalRecords, documentUploads, validationAttempts, orderHistory } = orderDetails;
        // Create a flattened object for CSV export
        const flatData = {
            // Order information
            order_id: order.id,
            order_number: order.order_number,
            status: order.status,
            priority: order.priority,
            modality: order.modality,
            body_part: order.body_part,
            laterality: order.laterality,
            cpt_code: order.final_cpt_code,
            cpt_description: order.final_cpt_code_description,
            // Handle ICD-10 codes (could be an array or string)
            icd10_codes: Array.isArray(order.final_icd10_codes)
                ? order.final_icd10_codes.join('; ')
                : order.final_icd10_codes,
            icd10_descriptions: Array.isArray(order.final_icd10_code_descriptions)
                ? order.final_icd10_code_descriptions.join('; ')
                : order.final_icd10_code_descriptions,
            clinical_indication: order.clinical_indication,
            original_dictation: order.original_dictation,
            validation_status: order.final_validation_status,
            compliance_score: order.final_compliance_score,
            contrast_indicated: order.is_contrast_indicated ? 'Yes' : 'No',
            auc_outcome: order.auc_outcome,
            guideline_source: order.guideline_source,
            // Patient information
            patient_id: patient?.id,
            patient_mrn: patient?.mrn,
            patient_first_name: patient?.first_name,
            patient_last_name: patient?.last_name,
            patient_dob: patient?.date_of_birth,
            patient_gender: patient?.gender,
            patient_address: patient?.address_line1,
            patient_address2: patient?.address_line2,
            patient_city: patient?.city,
            patient_state: patient?.state,
            patient_zip: patient?.zip_code,
            patient_phone: patient?.phone_number,
            patient_email: patient?.email,
            // Insurance information (primary)
            insurance_provider: insurance?.[0]?.insurer_name,
            insurance_policy_number: insurance?.[0]?.policy_number,
            insurance_group_number: insurance?.[0]?.group_number,
            insurance_plan_type: insurance?.[0]?.plan_type,
            insurance_subscriber_name: insurance?.[0]?.subscriber_name,
            insurance_subscriber_relationship: insurance?.[0]?.subscriber_relationship,
            // Secondary insurance (if available)
            secondary_insurance_provider: insurance?.[1]?.insurer_name,
            secondary_insurance_policy_number: insurance?.[1]?.policy_number,
            secondary_insurance_group_number: insurance?.[1]?.group_number,
            // Referring information
            referring_physician: order.referring_physician_name,
            referring_physician_npi: order.referring_physician_npi,
            referring_organization: order.referring_organization_name,
            referring_location: order.referring_location_name,
            // Clinical records summary (if available)
            clinical_records_count: clinicalRecords?.length || 0,
            clinical_records_summary: clinicalRecords?.length
                ? clinicalRecords.map(record => record.record_type).join('; ')
                : 'None',
            // Document uploads
            document_uploads_count: documentUploads?.length || 0,
            document_uploads_summary: documentUploads?.length
                ? documentUploads.map(doc => doc.document_type).join('; ')
                : 'None',
            // Validation information
            validation_attempts_count: validationAttempts?.length || 0,
            last_validation_date: validationAttempts?.length
                ? validationAttempts[validationAttempts.length - 1]?.created_at
                : undefined,
            override_status: order.override_status ? 'Yes' : 'No',
            override_reason: order.override_justification || 'N/A',
            // Order history
            order_created_at: order.created_at,
            order_updated_at: order.updated_at,
            order_signed_at: order.signature_date,
            order_signed_by: order.signed_by_user_name,
            // Additional timestamps from history if available
            sent_to_radiology_at: getHistoryTimestamp(orderHistory, 'sent_to_radiology'),
            scheduled_at: getHistoryTimestamp(orderHistory, 'scheduled'),
            completed_at: getHistoryTimestamp(orderHistory, 'completed')
        };
        // Use PapaParse to generate CSV
        const csvString = Papa.unparse([flatData], {
            header: true,
            newline: '\n',
            skipEmptyLines: true,
            quotes: true // Always quote fields for maximum compatibility
        });
        return csvString;
    }
    catch (error) {
        logger_1.default.error('Error generating CSV export:', error instanceof Error ? error.message : String(error));
        throw new Error('Failed to generate CSV export');
    }
}
/**
 * Helper function to extract timestamp from order history
 * @param history Order history array
 * @param statusToFind Status to find in history
 * @returns Timestamp string or undefined
 */
function getHistoryTimestamp(history, statusToFind) {
    if (!history || !Array.isArray(history))
        return undefined;
    const entry = history.find(h => h.new_status === statusToFind);
    return entry?.created_at;
}
exports.default = generateCsvExport;
//# sourceMappingURL=generate-csv-export.js.map