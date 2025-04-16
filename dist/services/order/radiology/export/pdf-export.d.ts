import { OrderDetails } from '../types';
/**
 * Generate PDF export of order data
 * @param orderDetails Order details object
 * @returns PDF buffer
 */
export declare function generatePdfExport(orderDetails: OrderDetails): Buffer;
export default generatePdfExport;
