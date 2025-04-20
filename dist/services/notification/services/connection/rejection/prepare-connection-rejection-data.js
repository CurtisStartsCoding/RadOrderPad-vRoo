import { getFrontendUrl } from '../request';
/**
 * Prepare the template data for a connection rejection notification
 * @param email Email address of the requesting organization admin
 * @param rejectedOrgName Name of the organization that requested the connection
 */
export function prepareConnectionRejectionData(email, rejectedOrgName) {
    return {
        email,
        rejectedOrgName,
        frontendUrl: getFrontendUrl()
    };
}
//# sourceMappingURL=prepare-connection-rejection-data.js.map