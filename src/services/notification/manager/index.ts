// Using AWS SES for email sending
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

/**
 * Notification Manager for sending emails
 */
export class NotificationManager {
  private static sesClient: SESClient;
  private static fromEmail: string;
  private static testMode: boolean;
  private static testEmail: string;

  /**
   * Initialize the notification manager
   */
  static initialize(): void {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    this.fromEmail = process.env.SES_FROM_EMAIL || 'no-reply@radorderpad.com';
    this.testMode = process.env.EMAIL_TEST_MODE === 'true';
    this.testEmail = process.env.TEST_EMAIL || 'test@example.com';
  }

  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param htmlBody HTML email body
   * @param textBody Plain text email body
   */
  static async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string
  ): Promise<void> {
    // In test mode, redirect all emails to the test email
    const recipient = this.testMode ? this.testEmail : to;

    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [recipient]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8'
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          }
        }
      }
    };

    try {
      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
      console.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send an invitation email
   * @param to Recipient email address
   * @param token Invitation token
   * @param organizationName Organization name
   * @param inviterName Name of the person who sent the invitation
   */
  static async sendInviteEmail(
    to: string,
    token: string,
    organizationName: string,
    inviterName: string
  ): Promise<void> {
    const subject = `Invitation to join ${organizationName} on RadOrderPad`;
    
    const invitationLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/accept-invitation?token=${token}`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>You've been invited to join ${organizationName}</h1>
          <p>Hello,</p>
          <p>${inviterName} has invited you to join ${organizationName} on RadOrderPad.</p>
          <p>Click the link below to accept the invitation and create your account:</p>
          <p><a href="${invitationLink}">Accept Invitation</a></p>
          <p>This invitation will expire in 7 days.</p>
          <p>If you have any questions, please contact ${inviterName}.</p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      You've been invited to join ${organizationName}
      
      Hello,
      
      ${inviterName} has invited you to join ${organizationName} on RadOrderPad.
      
      Click the link below to accept the invitation and create your account:
      ${invitationLink}
      
      This invitation will expire in 7 days.
      
      If you have any questions, please contact ${inviterName}.
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Send a verification email
   * @param to Recipient email address
   * @param token Verification token
   * @param data Additional data for the email
   */
  static async sendVerificationEmail(
    to: string,
    token: string,
    data: { firstName: string; organizationName: string }
  ): Promise<void> {
    const subject = 'Verify your email address for RadOrderPad';
    
    const verificationLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/verify-email?token=${token}`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>Verify your email address</h1>
          <p>Hello ${data.firstName},</p>
          <p>Thank you for registering ${data.organizationName} on RadOrderPad.</p>
          <p>Please click the link below to verify your email address:</p>
          <p><a href="${verificationLink}">Verify Email Address</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not register for RadOrderPad, please ignore this email.</p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      Verify your email address
      
      Hello ${data.firstName},
      
      Thank you for registering ${data.organizationName} on RadOrderPad.
      
      Please click the link below to verify your email address:
      ${verificationLink}
      
      This link will expire in 24 hours.
      
      If you did not register for RadOrderPad, please ignore this email.
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Send a connection request notification
   * @param to Recipient email address
   * @param organizationName Organization name requesting connection
   */
  static async sendConnectionRequest(
    to: string,
    organizationName: string
  ): Promise<void> {
    const subject = `Connection Request from ${organizationName} on RadOrderPad`;
    
    const connectionLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections/pending`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>New Connection Request</h1>
          <p>Hello,</p>
          <p>${organizationName} has requested to connect with your organization on RadOrderPad.</p>
          <p>Please log in to your account to review and respond to this connection request:</p>
          <p><a href="${connectionLink}">View Connection Request</a></p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      New Connection Request
      
      Hello,
      
      ${organizationName} has requested to connect with your organization on RadOrderPad.
      
      Please log in to your account to review and respond to this connection request:
      ${connectionLink}
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Send a connection approved notification
   * @param to Recipient email address
   * @param organizationName Organization name that approved the connection
   */
  static async sendConnectionApproved(
    to: string,
    organizationName: string
  ): Promise<void> {
    const subject = `Connection Approved with ${organizationName} on RadOrderPad`;
    
    const connectionLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>Connection Request Approved</h1>
          <p>Hello,</p>
          <p>${organizationName} has approved your connection request on RadOrderPad.</p>
          <p>You can now exchange orders and information with this organization.</p>
          <p>Log in to your account to view your connections:</p>
          <p><a href="${connectionLink}">View Connections</a></p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      Connection Request Approved
      
      Hello,
      
      ${organizationName} has approved your connection request on RadOrderPad.
      
      You can now exchange orders and information with this organization.
      
      Log in to your account to view your connections:
      ${connectionLink}
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Send a connection rejected notification
   * @param to Recipient email address
   * @param organizationName Organization name that rejected the connection
   */
  static async sendConnectionRejected(
    to: string,
    organizationName: string
  ): Promise<void> {
    const subject = `Connection Request Declined by ${organizationName} on RadOrderPad`;
    
    const connectionLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>Connection Request Declined</h1>
          <p>Hello,</p>
          <p>${organizationName} has declined your connection request on RadOrderPad.</p>
          <p>If you believe this was in error, please contact the organization directly.</p>
          <p>Log in to your account to view your connections:</p>
          <p><a href="${connectionLink}">View Connections</a></p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      Connection Request Declined
      
      Hello,
      
      ${organizationName} has declined your connection request on RadOrderPad.
      
      If you believe this was in error, please contact the organization directly.
      
      Log in to your account to view your connections:
      ${connectionLink}
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Send a connection terminated notification
   * @param to Recipient email address
   * @param organizationName Organization name that terminated the connection
   */
  static async sendConnectionTerminated(
    to: string,
    organizationName: string
  ): Promise<void> {
    const subject = `Connection Terminated by ${organizationName} on RadOrderPad`;
    
    const connectionLink = `${process.env.FRONTEND_URL || 'https://app.radorderpad.com'}/connections`;
    
    const htmlBody = `
      <html>
        <body>
          <h1>Connection Terminated</h1>
          <p>Hello,</p>
          <p>${organizationName} has terminated their connection with your organization on RadOrderPad.</p>
          <p>You will no longer be able to exchange orders and information with this organization.</p>
          <p>Log in to your account to view your connections:</p>
          <p><a href="${connectionLink}">View Connections</a></p>
          <p>Best regards,<br>The RadOrderPad Team</p>
        </body>
      </html>
    `;
    
    const textBody = `
      Connection Terminated
      
      Hello,
      
      ${organizationName} has terminated their connection with your organization on RadOrderPad.
      
      You will no longer be able to exchange orders and information with this organization.
      
      Log in to your account to view your connections:
      ${connectionLink}
      
      Best regards,
      The RadOrderPad Team
    `;
    
    await this.sendEmail(to, subject, htmlBody, textBody);
  }
}

// Initialize the notification manager
NotificationManager.initialize();

export default NotificationManager;