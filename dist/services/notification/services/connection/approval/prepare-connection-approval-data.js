import { getFrontendUrl } from '../request';
/**
 * Prepare the template data for a connection approval notification
 * @param email Email address of the requesting organization admin
 * @param approvedOrgName Name of the organization that requested the connection
 */
export function prepareConnectionApprovalData(email, approvedOrgName) {
    return {
        email,
        approvedOrgName,
        frontendUrl: getFrontendUrl()
    };
}
//# sourceMappingURL=prepare-connection-approval-data.js.map