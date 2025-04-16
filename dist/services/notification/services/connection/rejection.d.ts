import { ConnectionRejectionEmailData } from '../../types';
/**
 * Prepare the template data for a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export declare function prepareConnectionRejectionData(email: string, rejectedOrgName: string): ConnectionRejectionEmailData;
/**
 * Send a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export declare function sendConnectionRejected(email: string, rejectedOrgName: string): Promise<void>;
