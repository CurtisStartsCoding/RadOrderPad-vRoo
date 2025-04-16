import { EmailContent, EmailTemplateData } from '../../types';
import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection approval emails
 */
export declare class ConnectionApprovalEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection approval
     * @param data Connection approval data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: ConnectionApprovalEmailTemplate;
export default _default;
