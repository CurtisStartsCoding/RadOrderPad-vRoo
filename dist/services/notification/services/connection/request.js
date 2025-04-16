"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrontendUrl = getFrontendUrl;
exports.prepareConnectionRequestData = prepareConnectionRequestData;
exports.sendConnectionRequest = sendConnectionRequest;
const email_sender_1 = __importDefault(require("../../email-sender"));
const templates_1 = require("../../templates");
const config_1 = __importDefault(require("../../../../config/config"));
/**
 * Get the frontend URL from environment variables
 */
function getFrontendUrl() {
    return config_1.default.frontendUrl;
}
/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
function prepareConnectionRequestData(email, requestingOrgName) {
    return {
        email,
        requestingOrgName,
        frontendUrl: getFrontendUrl()
    };
}
/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
async function sendConnectionRequest(email, requestingOrgName) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending connection request notification to ${email}`);
    // Prepare the template data
    const templateData = prepareConnectionRequestData(email, requestingOrgName);
    // Generate the email content
    const emailContent = templates_1.connectionRequestTemplate.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
//# sourceMappingURL=request.js.map