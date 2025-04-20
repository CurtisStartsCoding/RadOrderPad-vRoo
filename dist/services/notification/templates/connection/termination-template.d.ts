import { EmailContent, ConnectionTerminationEmailData } from '../../types.js';
import { BaseEmailTemplate } from '../email-template-base.js';
/**
 * Template for connection termination emails
 */
export declare class ConnectionTerminationEmailTemplate extends BaseEmailTemplate {
    /**
     * Generate email content for connection termination
     * @param data Connection termination data
     * @returns Email content
     */
    generateContent(data: ConnectionTerminationEmailData): EmailContent;
}
declare const _default: ConnectionTerminationEmailTemplate;
export default _default;
