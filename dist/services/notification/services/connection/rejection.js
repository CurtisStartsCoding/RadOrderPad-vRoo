"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareConnectionRejectionData = prepareConnectionRejectionData;
exports.sendConnectionRejected = sendConnectionRejected;
const email_sender_1 = __importDefault(require("../../email-sender"));
const templates_1 = require("../../templates");
const request_1 = require("./request");
/**
 * Prepare the template data for a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
function prepareConnectionRejectionData(email, rejectedOrgName) {
    return {
        email,
        rejectedOrgName,
        frontendUrl: (0, request_1.getFrontendUrl)()
    };
}
/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
async function sendConnectionRejected(email, rejectedOrgName) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending connection rejection notification to ${email}`);
    // Prepare the template data
    const templateData = prepareConnectionRejectionData(email, rejectedOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionRejectionTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=rejection.js.map