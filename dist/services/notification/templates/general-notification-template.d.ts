import { EmailContent, EmailTemplateData } from '../types.js';
import { BaseEmailTemplate } from './email-template-base.js';
/**
 * Template for general notification emails
 */
export declare class GeneralNotificationEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for general notification
     * @param data Notification data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: GeneralNotificationEmailTemplate;
export default _default;
