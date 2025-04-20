import emailSender from '../email-sender.js';
import { generalNotificationTemplate } from '../templates/index.js';
/**
 * Service for handling general notifications
 */
export class GeneralNotificationService {
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
        const emailContent = generalNotificationTemplate.generateContent(templateData);
        // Send the email
        await emailSender.sendEmail(email, emailContent.subject, emailContent.textBody, emailContent.htmlBody);
    }
}
// Create and export a singleton instance
export default new GeneralNotificationService();
//# sourceMappingURL=general-notifications.js.map