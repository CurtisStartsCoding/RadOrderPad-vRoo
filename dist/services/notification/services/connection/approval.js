"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionApprovalData = prepareConnectionApprovalData;
exports.sendConnectionApproved = sendConnectionApproved;
const email_sender_1 = __importDefault(require("../../email-sender"));
const templates_1 = require("../../templates");
const request_1 = require("./request");
/**
 * Prepare the template data for a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
function prepareConnectionApprovalData(email, approvedOrgName) {
    return {
        email,
        approvedOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
/**
 * Send a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
async function sendConnectionApproved(email, approvedOrgName) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending connection approval notification to ${email}`);
    // Prepare the template data
    const templateData = prepareConnectionApprovalData(email, approvedOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionApprovalTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=approval.js.map