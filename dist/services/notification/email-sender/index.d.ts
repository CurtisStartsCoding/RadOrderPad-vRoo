import { EmailSender } from '../types';
/**
 * AWS SES Email Sender implementation
 */
export declare class AwsSesEmailSender implements EmailSender {
    /**
     * Send an email using AWS SES
     * @param to Recipient email address
     * @param subject Email subject
     * @param textBody Plain text email body
     * @param htmlBody HTML email body (optional)
     */
    sendEmail(to: string, subject: string, textBody: string, htmlBody?: string): Promise<void>;
}
export * from './client';
export * from './test-mode';
export * from './params-builder';
export * from './send';
declare const _default: AwsSesEmailSender;
export default _default;
