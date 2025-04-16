"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomingOrders = getIncomingOrders;
const db_1 = require("../../../config/db");
const query_1 = require("./query");
/**
 * Get incoming orders queue for radiology group
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Promise with orders list
 */
async function getIncomingOrders(orgId, filters = {}) {
    try {
        // Build the main query
        const { query, params } = (0, query_1.buildOrderQuery)(orgId, filters);
        // Execute the query
        const result = await (0, db_1.queryPhiDb)(query, params);
        // Build the count query for pagination
        const { query: countQuery, params: countParams } = (0, query_1.buildCountQuery)(orgId, filters);
        // Execute the count query
        const countResult = await (0, db_1.queryPhiDb)(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].total);
        // Get pagination parameters
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        // Create pagination result
        const pagination = (0, query_1.createPaginationResult)(totalCount, page, limit);
        // Return the final result
        return {
            orders: result.rows,
            pagination
        };
    }
    catch (error) {
        console.error('Error in getIncomingOrders:', error);
        throw error;
    }
}
exports.default = getIncomingOrders;
//# sourceMappingURL=incoming-orders.service.js.map