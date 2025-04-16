"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionApproved = sendConnectionApproved;
const config_1 = __importDefault(require("../../../../config/config"));
const templates_1 = require("../../templates");
const send_email_1 = __importDefault(require("./send-email"));
/**
 * Send a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
async function sendConnectionApproved(email, approvedOrgName) {
    // Prepare the template data
    const templateData = {
        email,
        approvedOrgName,
        frontendUrl: config_1.default.frontendUrl
    };
    // Send the email using the common function
    await (0, send_email_1.default)(email, templates_1.connectionApprovalTemplate, templateData, 'connection approval');
}
exports.default = sendConnectionApproved;
//# sourceMappingURL=approval.js.map