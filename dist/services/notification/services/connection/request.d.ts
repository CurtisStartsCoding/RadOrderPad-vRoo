import { ConnectionRequestEmailData } from '../../types';
/**
 * Get the frontend URL from environment variables
 */
export declare function getFrontendUrl(): string;
/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export declare function prepareConnectionRequestData(email: string, requestingOrgName: string): ConnectionRequestEmailData;
/**
 * Send a connection request notification to an organization
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export declare function sendConnectionRequest(email: string, requestingOrgName: string): Promise<void>;
