/**
 * Send a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
export declare function sendConnectionTerminated(email: string, partnerOrgName: string, terminatingOrgName: string): Promise<void>;
export default sendConnectionTerminated;
