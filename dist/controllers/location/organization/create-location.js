"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocation = void 0;
const location_1 = __importDefault(require("../../../services/location"));
const types_1 = require("../types");
/**
 * Create a new location for the authenticated user's organization
 * @param req Express request object
 * @param res Express response object
 */
const createLocation = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!(0, types_1.checkAuthentication)(req, res)) {
            return;
        }
        const orgId = req.user.orgId;
        const locationData = req.body;
        // Validate required fields
        if (!locationData.name) {
            res.status(400).json({ message: 'Location name is required' });
            return;
        }
        const location = await location_1.default.createLocation(orgId, locationData);
        res.status(201).json({
            message: 'Location created successfully',
            location
        });
    }
    catch (error) {
        (0, types_1.handleControllerError)(res, error, 'Failed to create location');
    }
};
exports.createLocation = createLocation;
exports.default = exports.createLocation;
//# sourceMappingURL=create-location.js.map