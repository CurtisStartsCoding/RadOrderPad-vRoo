"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionRequest = sendConnectionRequest;
const email_sender_1 = __importDefault(require("../../../email-sender"));
const templates_1 = require("../../../templates");
const prepare_connection_request_data_1 = require("./prepare-connection-request-data");
/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
async function sendConnectionRequest(email, requestingOrgName) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending connection request notification to ${email}`);
    // Prepare the template data
    const templateData = (0, prepare_connection_request_data_1.prepareConnectionRequestData)(email, requestingOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionRequestTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=send-connection-request.js.map