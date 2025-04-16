import { Request, Response } from 'express';
/**
 * Get full details of an order
 * @route GET /api/radiology/orders/:orderId
 */
export declare function getOrderDetails(req: Request, res: Response): Promise<void>;
export default getOrderDetails;
