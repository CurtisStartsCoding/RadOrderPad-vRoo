"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralNotificationEmailTemplate = void 0;
const email_template_base_js_1 = require("./email-template-base.js");
/**
 * Template for general notification emails
 */
class GeneralNotificationEmailTemplate extends email_template_base_js_1.BaseEmailTemplate {
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
exports.GeneralNotificationEmailTemplate = GeneralNotificationEmailTemplate;
// Create and export a singleton instance
exports.default = new GeneralNotificationEmailTemplate();
//# sourceMappingURL=general-notification-template.js.map