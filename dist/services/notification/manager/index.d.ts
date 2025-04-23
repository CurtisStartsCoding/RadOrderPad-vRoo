/**
 * Notification Manager for sending emails
 */
export declare class NotificationManager {
    private static sesClient;
    private static fromEmail;
    private static testMode;
    private static testEmail;
    /**
     * Initialize the notification manager
     */
    static initialize(): void;
    /**
     * Send an email
     * @param to Recipient email address
     * @param subject Email subject
     * @param htmlBody HTML email body
     * @param textBody Plain text email body
     */
    static sendEmail(to: string, subject: string, htmlBody: string, textBody: string): Promise<void>;
    /**
     * Send an invitation email
     * @param to Recipient email address
     * @param token Invitation token
     * @param organizationName Organization name
     * @param inviterName Name of the person who sent the invitation
     */
    static sendInviteEmail(to: string, token: string, organizationName: string, inviterName: string): Promise<void>;
    /**
     * Send a verification email
     * @param to Recipient email address
     * @param token Verification token
     * @param data Additional data for the email
     */
    static sendVerificationEmail(to: string, token: string, data: {
        firstName: string;
        organizationName: string;
    }): Promise<void>;
    /**
     * Send a connection request notification
     * @param to Recipient email address
     * @param organizationName Organization name requesting connection
     */
    static sendConnectionRequest(to: string, organizationName: string): Promise<void>;
    /**
     * Send a connection approved notification
     * @param to Recipient email address
     * @param organizationName Organization name that approved the connection
     */
    static sendConnectionApproved(to: string, organizationName: string): Promise<void>;
    /**
     * Send a connection rejected notification
     * @param to Recipient email address
     * @param organizationName Organization name that rejected the connection
     */
    static sendConnectionRejected(to: string, organizationName: string): Promise<void>;
    /**
     * Send a connection terminated notification
     * @param to Recipient email address
     * @param organizationName Organization name that terminated the connection
     */
    static sendConnectionTerminated(to: string, organizationName: string): Promise<void>;
}
export default NotificationManager;
