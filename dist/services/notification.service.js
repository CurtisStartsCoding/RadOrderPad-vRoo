"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_sender_1 = __importDefault(require("./notification/email-sender"));
/**
 * Service for handling notifications via AWS SES
 * This maintains the original API while using the refactored modules
 */
class NotificationService {
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    async sendEmail(to, subject, textBody, htmlBody) {
        return email_sender_1.default.sendEmail(to, subject, textBody, htmlBody);
    }
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        const subject = `Invitation to join ${organizationName} on RadOrderPad`;
        // Create the invitation link
        const invitationLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/accept-invitation?token=${token}`;
        // Create the email body
        const textBody = `
Hello,

You have been invited by ${inviterName} to join ${organizationName} on RadOrderPad.

Please click the following link to accept the invitation:
${invitationLink}

This invitation link will expire in 7 days.

If you have any questions, please contact ${inviterName}.

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>RadOrderPad Invitation</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You have been invited by <strong>${inviterName}</strong> to join <strong>${organizationName}</strong> on RadOrderPad.</p>
      <p>Please click the button below to accept the invitation:</p>
      <p><a href="${invitationLink}" class="button">Accept Invitation</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${invitationLink}</p>
      <p>This invitation link will expire in 7 days.</p>
      <p>If you have any questions, please contact ${inviterName}.</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending invitation email to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        const subject = 'Password Reset Request - RadOrderPad';
        // Create the reset link
        const resetLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/reset-password?token=${token}`;
        // Create the email body
        const textBody = `
Hello,

We received a request to reset your password for your RadOrderPad account.

Please click the following link to reset your password:
${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password for your RadOrderPad account.</p>
      <p>Please click the button below to reset your password:</p>
      <p><a href="${resetLink}" class="button">Reset Password</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending password reset email to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    async sendNotificationEmail(email, subject, message) {
        // Create the email body
        const textBody = `
Hello,

${message}

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>RadOrderPad Notification</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>${message}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending notification email to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a connection request notification to an organization
     * @param email Email address of the target organization admin
     * @param requestingOrgName Name of the organization requesting the connection
     */
    async sendConnectionRequest(email, requestingOrgName) {
        const subject = `New Connection Request from ${requestingOrgName}`;
        // Create the connections link
        const connectionsLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections/requests`;
        // Create the email body
        const textBody = `
Hello,

${requestingOrgName} has requested to connect with your organization on RadOrderPad.

Please log in to your RadOrderPad account to review and respond to this connection request:
${connectionsLink}

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Connection Request</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p><strong>${requestingOrgName}</strong> has requested to connect with your organization on RadOrderPad.</p>
      <p>Please log in to your RadOrderPad account to review and respond to this connection request:</p>
      <p><a href="${connectionsLink}" class="button">View Connection Requests</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending connection request notification to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param requestingOrgName Name of the organization that requested the connection
     */
    async sendConnectionApproved(email, requestingOrgName) {
        const subject = `Connection Request Approved`;
        // Create the connections link
        const connectionsLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
        // Create the email body
        const textBody = `
Hello,

Your connection request to partner with another organization has been approved.

You can now view and manage your connections in your RadOrderPad account:
${connectionsLink}

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Connection Request Approved</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your connection request to partner with another organization has been approved.</p>
      <p>You can now view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending connection approval notification to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param requestingOrgName Name of the organization that requested the connection
     */
    async sendConnectionRejected(email, requestingOrgName) {
        const subject = `Connection Request Rejected`;
        // Create the connections link
        const connectionsLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
        // Create the email body
        const textBody = `
Hello,

Your connection request to partner with another organization has been rejected.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Connection Request Rejected</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your connection request to partner with another organization has been rejected.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending connection rejection notification to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    async sendConnectionTerminated(email, partnerOrgName, terminatingOrgName) {
        const subject = `Connection Terminated`;
        // Create the connections link
        const connectionsLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
        // Create the email body
        const textBody = `
Hello,

${terminatingOrgName} has terminated their connection with your organization on RadOrderPad.

You can view and manage your connections in your RadOrderPad account:
${connectionsLink}

Best regards,
The RadOrderPad Team
    `;
        const htmlBody = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 10px 20px; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Connection Terminated</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p><strong>${terminatingOrgName}</strong> has terminated their connection with your organization on RadOrderPad.</p>
      <p>You can view and manage your connections in your RadOrderPad account:</p>
      <p><a href="${connectionsLink}" class="button">View Connections</a></p>
      <p>Or copy and paste this link into your browser:</p>
      <p>${connectionsLink}</p>
      <p>Best regards,<br>The RadOrderPad Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
        // Log the attempt
        console.log(`[NOTIFICATION] Sending connection termination notification to ${email}`);
        // Send the email
        await this.sendEmail(email, subject, textBody, htmlBody);
    }
}
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map