/**
 * Check if the user is authenticated and return the user's organization ID
 * @param req Express request object
 * @param res Express response object
 * @returns The user's organization ID if authenticated, null otherwise
 */
export function authenticateUser(req, res) {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return null;
    }
    return {
        orgId: req.user.orgId,
        userId: req.user.userId
    };
}
//# sourceMappingURL=auth-utils.js.map