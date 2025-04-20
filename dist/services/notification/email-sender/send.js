"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const client_ses_1 = require("@aws-sdk/client-ses");
const client_1 = require("./client");
const test_mode_1 = require("./test-mode");
const params_builder_1 = require("./params-builder");
/**
 * Send an email using AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 */
async function sendEmail(to, subject, textBody, htmlBody) {
    try {
        // Check if we're in test mode and should skip sending
        if ((0, test_mode_1.handleTestMode)(to, subject, textBody)) {
            return;
        }
        // Build the email parameters
        const params = (0, params_builder_1.buildEmailParams)(to, subject, textBody, htmlBody);
        // Create the command
        const command = new client_ses_1.SendEmailCommand(params);
        // Send the email
        await client_1.sesClient.send(command);
        // Log success
        console.log(`[NOTIFICATION] Email sent successfully to ${to}`);
    }
    catch (error) {
        // Log error
        console.error(`[NOTIFICATION] Failed to send email to ${to}:`, error);
        throw error;
    }
}
//# sourceMappingURL=send.js.map