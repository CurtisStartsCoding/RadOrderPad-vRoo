"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRelationshipId = validateRelationshipId;
/**
 * Validate a relationship ID from request parameters
 * @param req Express request object
 * @param res Express response object
 * @returns The validated relationship ID if valid, null otherwise
 */
function validateRelationshipId(req, res) {
    const relationshipId = parseInt(req.params.relationshipId);
    if (isNaN(relationshipId)) {
        res.status(400).json({ message: 'Invalid relationship ID' });
        return null;
    }
    return relationshipId;
}
//# sourceMappingURL=validate-relationship-id.js.map