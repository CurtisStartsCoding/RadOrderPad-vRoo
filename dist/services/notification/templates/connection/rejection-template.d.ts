import { EmailContent, EmailTemplateData } from '../../types';
import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection rejection emails
 */
export declare class ConnectionRejectionEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection rejection
     * @param data Connection rejection data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: ConnectionRejectionEmailTemplate;
export default _default;
