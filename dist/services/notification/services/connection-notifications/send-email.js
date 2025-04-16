"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTemplatedEmail = sendTemplatedEmail;
const email_sender_1 = __importDefault(require("../../email-sender"));
/**
 * Common function to send an email using a template
 * @param email Email address to send to
 * @param template Email template to use
 * @param templateData Data to populate the template with
 * @param notificationType Type of notification for logging
 */
async function sendTemplatedEmail(email, template, templateData, notificationType) {
    // Log the attempt
    console.log(`[NOTIFICATION] Sending ${notificationType} notification to ${email}`);
    // Generate the email content
    const emailContent = template.generateContent(templateData);
    // Send the email
    await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
}
exports.default = sendTemplatedEmail;
//# sourceMappingURL=send-email.js.map