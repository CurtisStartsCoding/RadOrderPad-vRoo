import { BaseEmailTemplate } from './email-template-base.js';
/**
 * Template for general notification emails
 */
export class GeneralNotificationEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for general notification
     * @param data Notification data
     * @returns Email content
     */
    generateContent(data) {
        const notificationData = data;
        const { subject, message } = notificationData;
        // Create the text email body
        const textBody = `
Hello,

${message}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p>${message}</p>
    `;
        const htmlBody = this.wrapHtml('RadOrderPad Notification', htmlContent);
        return {
            subject,
            textBody,
            htmlBody
        };
    }
}
// Create and export a singleton instance
export default new GeneralNotificationEmailTemplate();
//# sourceMappingURL=general-notification-template.js.map