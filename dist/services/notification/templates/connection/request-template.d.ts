import { EmailContent, EmailTemplateData } from '../../types';
import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection request emails
 */
export declare class ConnectionRequestEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection request
     * @param data Connection request data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: ConnectionRequestEmailTemplate;
export default _default;
