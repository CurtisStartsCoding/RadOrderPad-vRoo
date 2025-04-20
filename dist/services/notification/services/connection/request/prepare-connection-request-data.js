import { getFrontendUrl } from './get-frontend-url';
/**
 * Prepare the template data for a connection request notification
 * @param email Email address of the target organization admin
 * @param requestingOrgName Name of the organization requesting the connection
 */
export function prepareConnectionRequestData(email, requestingOrgName) {
    return {
        email,
        requestingOrgName,
        frontendUrl: getFrontendUrl()
    };
}
//# sourceMappingURL=prepare-connection-request-data.js.map