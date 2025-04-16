import { OrderFilters, IncomingOrdersResult } from './types';
/**
 * Get incoming orders queue for radiology group
 * @param orgId Radiology organization ID
 * @param filters Filter parameters
 * @returns Promise with orders list
 */
export declare function getIncomingOrders(orgId: number, filters?: OrderFilters): Promise<IncomingOrdersResult>;
export default getIncomingOrders;
