import { EmailContent, EmailTemplateData } from '../types';
import { BaseEmailTemplate } from './email-template-base';
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
export declare const connectionRequestTemplate: ConnectionRequestEmailTemplate;
export declare const connectionApprovalTemplate: ConnectionApprovalEmailTemplate;
export declare const connectionRejectionTemplate: ConnectionRejectionEmailTemplate;
export declare const connectionTerminationTemplate: ConnectionTerminationEmailTemplate;
