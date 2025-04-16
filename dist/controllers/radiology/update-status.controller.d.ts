import { Request, Response } from 'express';
/**
 * Update order status
 * @route POST /api/radiology/orders/:orderId/update-status
 */
export declare function updateOrderStatus(req: Request, res: Response): Promise<void>;
export default updateOrderStatus;
