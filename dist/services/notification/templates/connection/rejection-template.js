"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRejectionEmailTemplate = void 0;
const email_template_base_1 = require("../email-template-base");
/**
 * Template for connection rejection emails
 */
class ConnectionRejectionEmailTemplate extends email_template_base_1.BaseEmailTemplate {
    /**
     * Generate email content for connection rejection
     * @param data Connection rejection data
     * @returns Email content
     */
    generateContent(data) {
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections`;
        // Create the text email body
        const textBody = `
Hello,

Your connection request to partner with another organization has been rejected.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p>Your connection request to partner with another organization has been rejected.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('Connection Request Rejected', htmlContent);
        return {
            subject: 'Connection Request Rejected',
            textBody,
            htmlBody
        };
    }
}
exports.ConnectionRejectionEmailTemplate = ConnectionRejectionEmailTemplate;
// Create and export a singleton instance
exports.default = new ConnectionRejectionEmailTemplate();
//# sourceMappingURL=rejection-template.js.map