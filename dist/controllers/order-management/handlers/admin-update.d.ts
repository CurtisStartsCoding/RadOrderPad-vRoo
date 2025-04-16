/**
 * Admin Update Handler
 *
 * This handler processes requests to add administrative updates to an order.
 */
import { Request, Response } from 'express';
/**
 * Add administrative updates to an order
 * @route POST /api/orders/:orderId/admin-update
 */
export declare function adminUpdate(req: Request, res: Response): Promise<void>;
