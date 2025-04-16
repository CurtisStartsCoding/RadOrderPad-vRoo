import { Request, Response } from 'express';
/**
 * Export order data in specified format
 * @route GET /api/radiology/orders/:orderId/export/:format
 */
export declare function exportOrder(req: Request, res: Response): Promise<void>;
export default exportOrder;
