/**
 * Send an email using AWS SES
 * @param to Recipient email address
 * @param subject Email subject
 * @param textBody Plain text email body
 * @param htmlBody HTML email body (optional)
 */
export declare function sendEmail(to: string, subject: string, textBody: string, htmlBody?: string): Promise<void>;
