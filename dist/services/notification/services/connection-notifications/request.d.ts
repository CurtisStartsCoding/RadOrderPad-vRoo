/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export declare function sendConnectionRequest(email: string, requestingOrgName: string): Promise<void>;
export default sendConnectionRequest;
