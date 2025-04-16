import { EmailSender } from './types';
/**
 * AWS SES Email Sender implementation
 */
export declare class AwsSesEmailSender implements EmailSender {
    private sesClient;
    private fromEmail;
    private testMode;
    /**
     * Create a new AWS SES Email Sender
     */
    constructor();
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    sendEmail(to: string, subject: string, textBody: string, htmlBody?: string): Promise<void>;
}
declare const _default: AwsSesEmailSender;
export default _default;
