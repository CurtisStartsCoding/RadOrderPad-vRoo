"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomingOrders = getIncomingOrders;
const radiology_1 = __importDefault(require("../../services/order/radiology"));
/**
 * Get incoming orders queue for radiology group
 * @route GET /api/radiology/orders
 */
async function getIncomingOrders(req, res) {
    try {
        // Get user information from the JWT token
        const orgId = req.user?.orgId;
        if (!orgId) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }
        // Extract filter parameters from query
        const filters = {};
        // Referring organization filter
        if (req.query.referringOrgId) {
            filters.referringOrgId = parseInt(req.query.referringOrgId);
        }
        // Priority filter
        if (req.query.priority) {
            filters.priority = req.query.priority;
        }
        // Modality filter
        if (req.query.modality) {
            filters.modality = req.query.modality;
        }
        // Date range filter
        if (req.query.startDate) {
            filters.startDate = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
            filters.endDate = new Date(req.query.endDate);
        }
        // Validation status filter
        if (req.query.validationStatus) {
            filters.validationStatus = req.query.validationStatus;
        }
        // Sorting
        if (req.query.sortBy) {
            filters.sortBy = req.query.sortBy;
        }
        if (req.query.sortOrder) {
            const sortOrder = req.query.sortOrder;
            if (sortOrder === 'asc' || sortOrder === 'desc') {
                filters.sortOrder = sortOrder;
            }
        }
        // Pagination
        if (req.query.page) {
            filters.page = parseInt(req.query.page);
        }
        if (req.query.limit) {
            filters.limit = parseInt(req.query.limit);
        }
        // Call the service to get the incoming orders
        const result = await radiology_1.default.getIncomingOrders(orgId, filters);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in getIncomingOrders controller:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}
exports.default = getIncomingOrders;
//# sourceMappingURL=incoming-orders.controller.js.map