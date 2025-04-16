"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionTerminated = sendConnectionTerminated;
const email_sender_1 = __importDefault(require("../../../email-sender"));
const templates_1 = require("../../../templates");
const prepare_connection_termination_data_1 = require("./prepare-connection-termination-data");
/**
 * Send a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
async function sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending connection termination notification to ${email}`);
    // Prepare the template data
    const templateData = (0, prepare_connection_termination_data_1.prepareConnectionTerminationData)(email, partnerOrgName, terminatingOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionTerminationTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=send-connection-terminated.js.map