import { OrderDetails } from '../types';
/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @returns CSV string
 */
export declare function generateCsvExport(orderDetails: OrderDetails): string;
export default generateCsvExport;
