"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionTerminationEmailTemplate = void 0;
const email_template_base_js_1 = require("../email-template-base.js");
/**
 * Template for connection termination emails
 */
class ConnectionTerminationEmailTemplate extends email_template_base_js_1.BaseEmailTemplate {
    /**
     * Generate email content for connection termination
     * @param data Connection termination data
     * @returns Email content
     */
    generateContent(data) {
        // Extract data
        const { terminatingOrgName, partnerOrgName } = data;
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections`;
        // Create the text email body
        const textBody = `
Hello,

${terminatingOrgName} has terminated their connection with ${partnerOrgName} on RadOrderPad.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p><strong>${terminatingOrgName}</strong> has terminated their connection with <strong>${partnerOrgName}</strong> on RadOrderPad.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('Connection Terminated', htmlContent);
        return {
            subject: 'Connection Terminated',
            textBody,
            htmlBody
        };
    }
}
exports.ConnectionTerminationEmailTemplate = ConnectionTerminationEmailTemplate;
// Create and export a singleton instance
exports.default = new ConnectionTerminationEmailTemplate();
//# sourceMappingURL=termination-template.js.map