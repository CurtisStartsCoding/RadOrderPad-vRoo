"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralNotificationService = void 0;
const email_sender_1 = __importDefault(require("../email-sender"));
const templates_1 = require("../templates");
/**
 * Service for handling general notifications
 */
class GeneralNotificationService {
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    async sendNotificationEmail(email, subject, message) {
        // Log the attempt
        console.log(`[NOTIFICATION] Sending notification email to ${email}`);
        // Prepare the template data
        const templateData = {
            email,
            subject,
            message
        };
        // Generate the email content
        const emailContent = templates_1.generalNotificationTemplate.generateContent(templateData);
        // Send the email
        await email_sender_1.default.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
    }
}
exports.GeneralNotificationService = GeneralNotificationService;
// Create and export a singleton instance
exports.default = new GeneralNotificationService();
//# sourceMappingURL=general-notifications.js.map