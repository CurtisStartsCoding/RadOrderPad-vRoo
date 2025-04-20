import { getFrontendUrl } from '../request';
/**
 * Prepare the template data for a connection termination notification
 * @param email Email address of the partner organization admin
 * @param partnerOrgName Name of the partner organization
 * @param terminatingOrgName Name of the organization terminating the connection
 */
export function prepareConnectionTerminationData(email, partnerOrgName, terminatingOrgName) {
    return {
        email,
        partnerOrgName,
        terminatingOrgName,
        frontendUrl: getFrontendUrl()
    };
}
//# sourceMappingURL=prepare-connection-termination-data.js.map