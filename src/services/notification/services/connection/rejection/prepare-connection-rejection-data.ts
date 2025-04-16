import { ConnectionRejectionEmailData } from '../../../types';
import { getFrontendUrl } from '../request';

/**
 * Prepare the template data for a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export function prepareConnectionRejectionData(
  email: string,
  rejectedOrgName: string
): ConnectionRejectionEmailData {
  return {
    email,
    rejectedOrgName,
    frontendUrl: getFrontendUrl()
  };
}