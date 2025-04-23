"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const list_pending_admin_service_1 = __importDefault(require("./list-pending-admin.service"));
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
    /**
     * List orders awaiting admin finalization
     * @param orgId Organization ID
     * @param options Pagination, sorting, and filtering options
     * @returns Promise with orders and pagination info
     */
    async listPendingAdminOrders(orgId, options) {
        return (0, list_pending_admin_service_1.default)(orgId, options);
    }
}
exports.default = new AdminOrderService();
//# sourceMappingURL=index.js.map