import { ConnectionApprovalEmailData } from '../../types';
/**
 * Prepare the template data for a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
export declare function prepareConnectionApprovalData(email: string, approvedOrgName: string): ConnectionApprovalEmailData;
/**
 * Send a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
export declare function sendConnectionApproved(email: string, approvedOrgName: string): Promise<void>;
