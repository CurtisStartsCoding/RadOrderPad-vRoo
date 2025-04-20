import { accountNotifications } from '../services';
/**
 * Account-related notification manager functions
 */
export class AccountNotificationManager {
    /**
     * Send an invitation email to a user
     * @param email Email address to send the invitation to
     * @param token Invitation token
     * @param organizationName Name of the organization
     * @param inviterName Name of the user who sent the invitation
     */
    async sendInviteEmail(email, token, organizationName, inviterName) {
        return accountNotifications.sendInviteEmail(email, token, organizationName, inviterName);
    }
    /**
     * Send a password reset email to a user
     * @param email Email address to send the reset link to
     * @param token Reset token
     */
    async sendPasswordResetEmail(email, token) {
        return accountNotifications.sendPasswordResetEmail(email, token);
    }
}
// Create and export a singleton instance
export default new AccountNotificationManager();
//# sourceMappingURL=account.js.map