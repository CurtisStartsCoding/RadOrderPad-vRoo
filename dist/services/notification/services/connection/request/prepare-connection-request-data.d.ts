import { ConnectionRequestEmailData } from '../../../types';
/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export declare function prepareConnectionRequestData(email: string, requestingOrgName: string): ConnectionRequestEmailData;
