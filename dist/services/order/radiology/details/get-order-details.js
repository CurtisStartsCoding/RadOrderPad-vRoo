"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = getOrderDetails;
const fetch_order_1 = require("./fetch-order");
const fetch_patient_1 = require("./fetch-patient");
const fetch_insurance_1 = require("./fetch-insurance");
const fetch_clinical_records_1 = require("./fetch-clinical-records");
const fetch_document_uploads_1 = require("./fetch-document-uploads");
const fetch_validation_attempts_1 = require("./fetch-validation-attempts");
const fetch_order_history_1 = require("./fetch-order-history");
/**
 * Get full details of an order
 * @param orderId Order ID
 * @param orgId Radiology organization ID
 * @returns Promise with order details
 */
async function getOrderDetails(orderId, orgId) {
    try {
        // 1. Get the order
        const order = await (0, fetch_order_1.fetchOrder)(orderId, orgId);
        // 2. Get patient information
        const patient = await (0, fetch_patient_1.fetchPatient)(order.patient_id);
        // 3. Get insurance information
        const insurance = await (0, fetch_insurance_1.fetchInsurance)(order.patient_id);
        // 4. Get clinical records
        const clinicalRecords = await (0, fetch_clinical_records_1.fetchClinicalRecords)(orderId);
        // 5. Get document uploads
        const documentUploads = await (0, fetch_document_uploads_1.fetchDocumentUploads)(orderId);
        // 6. Get validation attempts
        const validationAttempts = await (0, fetch_validation_attempts_1.fetchValidationAttempts)(orderId);
        // 7. Get order history
        const orderHistory = await (0, fetch_order_history_1.fetchOrderHistory)(orderId);
        // Combine all data into a comprehensive order package
        return {
            order,
            patient,
            insurance,
            clinicalRecords,
            documentUploads,
            validationAttempts,
            orderHistory
        };
    }
    catch (error) {
        console.error('Error in getOrderDetails:', error);
        throw error;
    }
}
exports.default = getOrderDetails;
//# sourceMappingURL=get-order-details.js.map