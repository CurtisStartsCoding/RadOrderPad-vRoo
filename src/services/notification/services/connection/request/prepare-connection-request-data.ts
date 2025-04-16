import { ConnectionRequestEmailData } from '../../../types';
import { getFrontendUrl } from './get-frontend-url';

/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export function prepareConnectionRequestData(
  email: string,
  requestingOrgName: string
): ConnectionRequestEmailData {
  return {
    email,
    requestingOrgName,
    frontendUrl: getFrontendUrl()
  };
}