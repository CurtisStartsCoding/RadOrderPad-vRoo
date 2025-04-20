"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsuranceInfo = exports.updatePatientInfo = exports.sendToRadiology = exports.handlePasteSupplemental = exports.handlePasteSummary = exports.AdminOrderController = void 0;
const paste_summary_controller_1 = __importDefault(require("./paste-summary.controller"));
exports.handlePasteSummary = paste_summary_controller_1.default;
const paste_supplemental_controller_1 = __importDefault(require("./paste-supplemental.controller"));
exports.handlePasteSupplemental = paste_supplemental_controller_1.default;
const send_to_radiology_controller_1 = __importDefault(require("./send-to-radiology.controller"));
exports.sendToRadiology = send_to_radiology_controller_1.default;
const update_patient_controller_1 = __importDefault(require("./update-patient.controller"));
exports.updatePatientInfo = update_patient_controller_1.default;
const update_insurance_controller_1 = __importDefault(require("./update-insurance.controller"));
exports.updateInsuranceInfo = update_insurance_controller_1.default;
/**
 * Controller for handling admin order operations
 */
class AdminOrderController {
    /**
     * Handle pasted EMR summary
     * @route POST /api/admin/orders/:orderId/paste-summary
     */
    async handlePasteSummary(req, res) {
        return (0, paste_summary_controller_1.default)(req, res);
    }
    /**
     * Handle pasted supplemental documents
     * @route POST /api/admin/orders/:orderId/paste-supplemental
     */
    async handlePasteSupplemental(req, res) {
        return (0, paste_supplemental_controller_1.default)(req, res);
    }
    /**
     * Send order to radiology
     * @route POST /api/admin/orders/:orderId/send-to-radiology
     */
    async sendToRadiology(req, res) {
        return (0, send_to_radiology_controller_1.default)(req, res);
    }
    /**
     * Update patient information
     * @route PUT /api/admin/orders/:orderId/patient-info
     */
    async updatePatientInfo(req, res) {
        return (0, update_patient_controller_1.default)(req, res);
    }
    /**
     * Update insurance information
     * @route PUT /api/admin/orders/:orderId/insurance-info
     */
    async updateInsuranceInfo(req, res) {
        return (0, update_insurance_controller_1.default)(req, res);
    }
}
exports.AdminOrderController = AdminOrderController;
// Export a singleton instance
exports.default = new AdminOrderController();
//# sourceMappingURL=index.js.map