"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionApprovalEmailTemplate = void 0;
const email_template_base_1 = require("../email-template-base");
/**
 * Template for connection approval emails
 */
class ConnectionApprovalEmailTemplate extends email_template_base_1.BaseEmailTemplate {
    /**
     * Generate email content for connection approval
     * @param data Connection approval data
     * @returns Email content
     */
    generateContent(data) {
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections`;
        // Create the text email body
        const textBody = `
Hello,

Your connection request to partner with another organization has been approved.

You can now view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p>Your connection request to partner with another organization has been approved.</p>
      <p>You can now view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('Connection Request Approved', htmlContent);
        return {
            subject: 'Connection Request Approved',
            textBody,
            htmlBody
        };
    }
}
exports.ConnectionApprovalEmailTemplate = ConnectionApprovalEmailTemplate;
// Create and export a singleton instance
exports.default = new ConnectionApprovalEmailTemplate();
//# sourceMappingURL=approval-template.js.map