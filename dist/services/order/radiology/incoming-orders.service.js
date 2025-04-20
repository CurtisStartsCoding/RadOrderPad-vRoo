import { queryPhiDb } from '../../../config/db';
import { buildOrderQuery, buildCountQuery, createPaginationResult } from './query';
/**
 * Get incoming orders queue for radiology group
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Promise with orders list
 */
export async function getIncomingOrders(orgId, filters = {}) {
    try {
        // Build the main query
        const { query, params } = buildOrderQuery(orgId, filters);
        // Execute the query
        const result = await queryPhiDb(query, params);
        // Build the count query for pagination
        const { query: countQuery, params: countParams } = buildCountQuery(orgId, filters);
        // Execute the count query
        const countResult = await queryPhiDb(countQuery, countParams);
        const totalCount = parseInt(countResult.rows[0].total);
        // Get pagination parameters
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        // Create pagination result
        const pagination = createPaginationResult(totalCount, page, limit);
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
export default getIncomingOrders;
//# sourceMappingURL=incoming-orders.service.js.map