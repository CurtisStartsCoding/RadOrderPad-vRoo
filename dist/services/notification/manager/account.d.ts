/**
 * Account-related notification manager functions
 */
export declare class AccountNotificationManager {
    /**
     * Send a verification email to a newly registered user
     * @param email Email address of the user
     * @param token Verification token
     * @param data Additional data for the email template
     */
    sendVerificationEmail(email: string, token: string, data: {
        firstName: string;
        organizationName: string;
    }): Promise<void>;
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
declare const _default: AccountNotificationManager;
export default _default;
