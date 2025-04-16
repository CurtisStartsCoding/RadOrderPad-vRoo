"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionTerminationTemplate = exports.connectionRejectionTemplate = exports.connectionApprovalTemplate = exports.connectionRequestTemplate = exports.ConnectionTerminationEmailTemplate = exports.ConnectionRejectionEmailTemplate = exports.ConnectionApprovalEmailTemplate = exports.ConnectionRequestEmailTemplate = void 0;
const email_template_base_1 = require("./email-template-base");
/**
 * Template for connection request emails
 */
class ConnectionRequestEmailTemplate extends email_template_base_1.BaseEmailTemplate {
    /**
     * Generate email content for connection request
     * @param data Connection request data
     * @returns Email content
     */
    generateContent(data) {
        const requestData = data;
        const { requestingOrgName } = requestData;
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections/requests`;
        // Create the text email body
        const textBody = `
Hello,

${requestingOrgName} has requested to connect with your organization on RadOrderPad.

Please log in to your RadOrderPad account to review and respond to this connection request:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p><strong>${requestingOrgName}</strong> has requested to connect with your organization on RadOrderPad.</p>
      <p>Please log in to your RadOrderPad account to review and respond to this connection request:</p>
      <p><a href="${connectionsLink}" class="button">View Connection Requests</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
    `;
        const htmlBody = this.wrapHtml('New Connection Request', htmlContent);
        return {
            subject: `New Connection Request from ${requestingOrgName}`,
            textBody,
            htmlBody
        };
    }
}
exports.ConnectionRequestEmailTemplate = ConnectionRequestEmailTemplate;
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
/**
 * Template for connection termination emails
 */
class ConnectionTerminationEmailTemplate extends email_template_base_1.BaseEmailTemplate {
    /**
     * Generate email content for connection termination
     * @param data Connection termination data
     * @returns Email content
     */
    generateContent(data) {
        const terminationData = data;
        const { terminatingOrgName } = terminationData;
        // Create the connections link
        const frontendUrl = this.getFrontendUrl(data);
        const connectionsLink = `${frontendUrl}/connections`;
        // Create the text email body
        const textBody = `
Hello,

${terminatingOrgName} has terminated their connection with your organization on RadOrderPad.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

${this.getEmailSignature()}
    `;
        // Create the HTML email body
        const htmlContent = `
      <p><strong>${terminatingOrgName}</strong> has terminated their connection with your organization on RadOrderPad.</p>
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
// Create and export singleton instances
exports.connectionRequestTemplate = new ConnectionRequestEmailTemplate();
exports.connectionApprovalTemplate = new ConnectionApprovalEmailTemplate();
exports.connectionRejectionTemplate = new ConnectionRejectionEmailTemplate();
exports.connectionTerminationTemplate = new ConnectionTerminationEmailTemplate();
//# sourceMappingURL=connection-templates.js.map