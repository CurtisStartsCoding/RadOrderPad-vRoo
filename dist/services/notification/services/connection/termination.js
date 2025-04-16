"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionTerminationData = prepareConnectionTerminationData;
exports.sendConnectionTerminated = sendConnectionTerminated;
const email_sender_1 = __importDefault(require("../../email-sender"));
const templates_1 = require("../../templates");
const request_1 = require("./request");
/**
 * Prepare the template data for a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
function prepareConnectionTerminationData(email, partnerOrgName, terminatingOrgName) {
    return {
        email,
        partnerOrgName,
        terminatingOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
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
    const templateData = prepareConnectionTerminationData(email, partnerOrgName, terminatingOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionTerminationTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=termination.js.map