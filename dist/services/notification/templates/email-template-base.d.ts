import { EmailContent, EmailTemplate, EmailTemplateData } from '../types.js';
/**
 * Base class for email templates
 */
export declare abstract class BaseEmailTemplate implements EmailTemplate {
    /**
     * Get the frontend URL from environment or use default
     * @returns Frontend URL
     */
    protected getFrontendUrl(data: EmailTemplateData): string;
    /**
     * Generate common HTML header styles
     * @returns HTML style string
     */
    protected getHtmlStyles(): string;
    /**
     * Generate common HTML footer
     * @returns HTML footer string
     */
    protected getHtmlFooter(): string;
    /**
     * Generate common email signature
     * @returns Email signature string
     */
    protected getEmailSignature(): string;
    /**
     * Generate HTML wrapper for email content
     * @param title Email title
     * @param content Email content
     * @returns Complete HTML email
     */
    protected wrapHtml(title: string, content: string): string;
    /**
     * Generate email content from template data
     * @param data Template data
     * @returns Email content
     */
    abstract generateContent(data: EmailTemplateData): EmailContent;
}
