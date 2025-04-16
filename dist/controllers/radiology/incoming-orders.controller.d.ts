import { Request, Response } from 'express';
/**
 * Get incoming orders queue for radiology group
 * @route GET /api/radiology/orders
 */
export declare function getIncomingOrders(req: Request, res: Response): Promise<void>;
export default getIncomingOrders;
