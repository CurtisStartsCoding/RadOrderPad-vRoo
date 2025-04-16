/**
 * Connection-related notification manager functions
 */
export declare class ConnectionNotificationManager {
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
declare const _default: ConnectionNotificationManager;
export default _default;
