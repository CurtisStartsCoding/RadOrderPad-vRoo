"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
/**
 * Service for handling admin order operations
 */
class AdminOrderService {
    /**
     * Handle pasted EMR summary
     * @param orderId Order ID
     * @param pastedText Pasted EMR summary text
     * @param userId User ID
     * @returns Promise with result
     */
    async handlePasteSummary(orderId, pastedText, userId) {
        return (0, handlers_1.handlePasteSummary)(orderId, pastedText, userId);
    }
    /**
     * Handle pasted supplemental documents
     * @param orderId Order ID
     * @param pastedText Pasted supplemental text
     * @param userId User ID
     * @returns Promise with result
     */
    async handlePasteSupplemental(orderId, pastedText, userId) {
        return (0, handlers_1.handlePasteSupplemental)(orderId, pastedText, userId);
    }
    /**
     * Update patient information
     * @param orderId Order ID
     * @param patientData Patient data
     * @param userId User ID
     * @returns Promise with result
     */
    async updatePatientInfo(orderId, patientData, userId) {
        return (0, handlers_1.updatePatientInfo)(orderId, patientData, userId);
    }
    /**
     * Update insurance information
     * @param orderId Order ID
     * @param insuranceData Insurance data
     * @param userId User ID
     * @returns Promise with result
     */
    async updateInsuranceInfo(orderId, insuranceData, userId) {
        return (0, handlers_1.updateInsuranceInfo)(orderId, insuranceData, userId);
    }
    /**
     * Send order to radiology
     * @param orderId Order ID
     * @param userId User ID
     * @returns Promise with result
     */
    async sendToRadiology(orderId, userId) {
        return (0, handlers_1.sendToRadiology)(orderId, userId);
    }
}
exports.default = new AdminOrderService();
//# sourceMappingURL=index.js.map