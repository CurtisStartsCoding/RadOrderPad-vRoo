"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignUserFromLocation = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * Unassign a user from a location
 * @param req Express request object
 * @param res Express response object
 */
const unassignUserFromLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        // Validate user and location IDs
        if (!(0, types_1.validateUserAndLocationIds)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const userId = parseInt(req.params.userId);
        const locationId = parseInt(req.params.locationId);
        try {
            const success = await location_1.default.unassignUserFromLocation(userId, locationId, orgId);
            if (success) {
                res.status(200).json({
                    message: 'User unassigned from location successfully',
                    userId,
                    locationId
                });
            }
            else {
                res.status(404).json({ message: 'User-location assignment not found' });
            }
        }
        catch (error) {
            // Handle not found or not authorized
            if (error.message.includes('not found or not authorized')) {
                res.status(404).json({ message: error.message });
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        (0, types_1.handleControllerError)(res, error, 'Failed to unassign user from location');
    }
};
exports.unassignUserFromLocation = unassignUserFromLocation;
exports.default = exports.unassignUserFromLocation;
//# sourceMappingURL=unassign-user-from-location.js.map