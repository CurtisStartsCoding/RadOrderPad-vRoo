import { EmailContent, EmailTemplateData } from '../../types';
import { BaseEmailTemplate } from '../email-template-base';
/**
 * Template for connection termination emails
 */
export declare class ConnectionTerminationEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection termination
     * @param data Connection termination data
     * @returns Email content
     */
    generateContent(data: EmailTemplateData): EmailContent;
}
declare const _default: ConnectionTerminationEmailTemplate;
export default _default;
