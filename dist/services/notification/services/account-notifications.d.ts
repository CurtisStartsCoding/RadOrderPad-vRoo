/**
 * Service for handling account-related notifications
 */
export declare class AccountNotificationService {
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
}
declare const _default: AccountNotificationService;
export default _default;
