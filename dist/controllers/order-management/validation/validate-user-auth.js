/**
 * Validates that the user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @returns The user ID if authenticated, undefined if not (response is sent in case of not authenticated)
 */
export function validateUserAuth(req, res) {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ message: 'User authentication required' });
        return undefined;
    }
    return userId;
}
//# sourceMappingURL=validate-user-auth.js.map