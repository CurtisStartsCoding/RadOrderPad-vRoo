import { EmailContent, EmailTemplate, EmailTemplateData } from '../types.js';
/**
 * Base class for email templates
 *
 * This abstract class provides common functionality for all email templates,
 * including HTML styling, email signatures, and utility methods for generating
 * consistent email content. All specific email templates should extend this class
 * and implement the generateContent method.
 *
 * Features:
 * - Consistent HTML styling across all emails
 * - Common header and footer elements
 * - Standard email signature
 * - Utility methods for frontend URL handling
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
     *
     * This abstract method must be implemented by all derived template classes.
     * It should transform the provided template data into a complete email content
     * object containing subject, text body, and optional HTML body.
     *
     * Implementation guidelines:
     * - Extract required fields from the data parameter
     * - Use the utility methods (getFrontendUrl, wrapHtml, etc.) for consistency
     * - Include both plain text and HTML versions of the email
     * - Return a complete EmailContent object
     *
     * @param data Template data specific to the email type
     * @returns Complete email content object with subject, text body, and HTML body
     */
    abstract generateContent(data: EmailTemplateData): EmailContent;
}
