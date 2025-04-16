/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export declare function sendConnectionRejected(email: string, rejectedOrgName: string): Promise<void>;
export default sendConnectionRejected;
