import { EmailContent, EmailTemplateData } from '../types';
import { BaseEmailTemplate } from './email-template-base';
/**
 * Template for password reset emails
 */
export declare class PasswordResetEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for password reset
     * @param data Password reset data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: PasswordResetEmailTemplate;
export default _default;
