import { EmailContent, EmailTemplateData } from '../types.js';
import { BaseEmailTemplate } from './email-template-base.js';
/**
 * Template for invitation emails
 */
export declare class InviteEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for invitation
     * @param data Invitation data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: InviteEmailTemplate;
export default _default;
