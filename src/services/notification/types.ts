import { SendEmailCommandInput } from '@aws-sdk/client-ses';

/**
 * Email recipient configuration
 */
export interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Email content configuration
 */
export interface EmailContent {
  subject: string;
  textBody: string;
  htmlBody?: string;
}

/**
 * Email template data
 */
export interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Email template interface
 */
export interface EmailTemplate {
  /**
   * Generate email content from template data
   * @param data Template data
   * @returns Email content
   */
  generateContent(data: EmailTemplateData): EmailContent;
}

/**
 * Email sender interface
 */
export interface EmailSender {
  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param textBody Plain text email body
   * @param htmlBody HTML email body (optional)
   * @returns Promise that resolves when email is sent
   */
  sendEmail(to: string, subject: string, textBody: string, htmlBody?: string): Promise<void>;
}

/**
 * Invitation email data
 */
export interface InvitationEmailData extends EmailTemplateData {
  email: string;
  token: string;
  organizationName: string;
  inviterName: string;
  frontendUrl: string;
}

/**
 * Password reset email data
 */
export interface PasswordResetEmailData extends EmailTemplateData {
  email: string;
  token: string;
  frontendUrl: string;
}

/**
 * General notification email data
 */
export interface NotificationEmailData extends EmailTemplateData {
  email: string;
  subject: string;
  message: string;
}

/**
 * Connection request email data
 */
export interface ConnectionRequestEmailData extends EmailTemplateData {
  email: string;
  requestingOrgName: string;
  frontendUrl: string;
}

/**
 * Connection approval email data
 */
export interface ConnectionApprovalEmailData extends EmailTemplateData {
  email: string;
  approvedOrgName: string;
  frontendUrl: string;
}

/**
 * Connection rejection email data
 */
export interface ConnectionRejectionEmailData extends EmailTemplateData {
  email: string;
  rejectedOrgName: string;
  frontendUrl: string;
}

/**
 * Connection termination email data
 */
export interface ConnectionTerminationEmailData extends EmailTemplateData {
  email: string;
  partnerOrgName: string;
  terminatingOrgName: string;
  frontendUrl: string;
}