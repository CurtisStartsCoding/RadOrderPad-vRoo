import { SendEmailCommandInput } from '@aws-sdk/client-ses';
/**
 * Build the email parameters for AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 * @returns SendEmailCommandInput object
 */
export declare function buildEmailParams(to: string, subject: string, textBody: string, htmlBody?: string): SendEmailCommandInput;
