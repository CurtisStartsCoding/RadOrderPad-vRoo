/**
 * Manager for handling different types of notifications
 * This class serves as a facade for the underlying notification services
 */
export declare class NotificationManager {
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    sendInviteEmail(email: string, token: string, organizationName: string, inviterName: string): Promise<void>;
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    /**
     * Send a notification email
     * @param email Email address to send the notification to
     * @param subject Email subject
     * @param message Email message
     */
    sendNotificationEmail(email: string, subject: string, message: string): Promise<void>;
    /**
     * Send a connection request notification to an organization
     * @param email Email address of the target organization admin
     * @param requestingOrgName Name of the organization requesting the connection
     */
    sendConnectionRequest(email: string, requestingOrgName: string): Promise<void>;
    /**
     * Send a connection approval notification
     * @param email Email address of the requesting organization admin
     * @param approvedOrgName Name of the organization that requested the connection
     */
    sendConnectionApproved(email: string, approvedOrgName: string): Promise<void>;
    /**
     * Send a connection rejection notification
     * @param email Email address of the requesting organization admin
     * @param rejectedOrgName Name of the organization that requested the connection
     */
    sendConnectionRejected(email: string, rejectedOrgName: string): Promise<void>;
    /**
     * Send a connection termination notification
     * @param email Email address of the partner organization admin
     * @param partnerOrgName Name of the partner organization
     * @param terminatingOrgName Name of the organization terminating the connection
     */
    sendConnectionTerminated(email: string, partnerOrgName: string, terminatingOrgName: string): Promise<void>;
}
declare const _default: NotificationManager;
export default _default;
