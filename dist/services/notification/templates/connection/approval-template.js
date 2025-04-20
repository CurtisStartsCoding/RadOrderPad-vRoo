import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection approval emails
 */
export class ConnectionApprovalEmailTemplate extends BaseEmailTemplate {
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
// Create and export a singleton instance
export default new ConnectionApprovalEmailTemplate();
//# sourceMappingURL=approval-template.js.map