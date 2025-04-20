import connectionService from '../../../services/connection';
import { authenticateUser } from '../auth-utils';
import { handleConnectionError } from '../error-utils';
/**
 * List pending incoming connection requests
 * @param req Express request object
 * @param res Express response object
 */
export async function listIncomingRequests(req, res) {
    try {
        // Authenticate user
        const user = authenticateUser(req, res);
        if (!user)
            return;
        // Get incoming requests
        const requests = await connectionService.listIncomingRequests(user.orgId);
        // Return response
        res.status(200).json({ requests });
    }
    catch (error) {
        handleConnectionError(error, res, 'listIncomingRequests');
    }
}
//# sourceMappingURL=list-incoming-requests.js.map