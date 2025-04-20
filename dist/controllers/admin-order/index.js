import handlePasteSummary from './paste-summary.controller';
import handlePasteSupplemental from './paste-supplemental.controller';
import sendToRadiology from './send-to-radiology.controller';
import updatePatientInfo from './update-patient.controller';
import updateInsuranceInfo from './update-insurance.controller';
/**
 * Controller for handling admin order operations
 */
export class AdminOrderController {
    /**
     * Handle pasted EMR summary
     * @route POST /api/admin/orders/:orderId/paste-summary
     */
    async handlePasteSummary(req, res) {
        return handlePasteSummary(req, res);
    }
    /**
     * Handle pasted supplemental documents
     * @route POST /api/admin/orders/:orderId/paste-supplemental
     */
    async handlePasteSupplemental(req, res) {
        return handlePasteSupplemental(req, res);
    }
    /**
     * Send order to radiology
     * @route POST /api/admin/orders/:orderId/send-to-radiology
     */
    async sendToRadiology(req, res) {
        return sendToRadiology(req, res);
    }
    /**
     * Update patient information
     * @route PUT /api/admin/orders/:orderId/patient-info
     */
    async updatePatientInfo(req, res) {
        return updatePatientInfo(req, res);
    }
    /**
     * Update insurance information
     * @route PUT /api/admin/orders/:orderId/insurance-info
     */
    async updateInsuranceInfo(req, res) {
        return updateInsuranceInfo(req, res);
    }
}
// Export a singleton instance
export default new AdminOrderController();
// Export individual controllers for direct use if needed
export { handlePasteSummary, handlePasteSupplemental, sendToRadiology, updatePatientInfo, updateInsuranceInfo };
//# sourceMappingURL=index.js.map