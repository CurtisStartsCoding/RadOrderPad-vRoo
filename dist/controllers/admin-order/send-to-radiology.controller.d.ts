import { Request, Response } from 'express';
/**
 * Send order to radiology
 * @route POST /api/admin/orders/:orderId/send-to-radiology
 */
export declare function sendToRadiology(req: Request, res: Response): Promise<void>;
export default sendToRadiology;
