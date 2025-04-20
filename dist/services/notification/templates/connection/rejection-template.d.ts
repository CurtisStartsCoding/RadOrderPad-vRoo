import { EmailContent, ConnectionRejectionEmailData } from '../../types.js';
import { BaseEmailTemplate } from '../email-template-base.js';
/**
 * Template for connection rejection emails
 */
export declare class ConnectionRejectionEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection rejection
     * @param data Connection rejection data
     * @returns Email content
     */
    generateContent(data: ConnectionRejectionEmailData): EmailContent;
}
declare const _default: ConnectionRejectionEmailTemplate;
export default _default;
