import { Request, Response } from 'express';
/**
 * Controller for handling order management operations
 */
export declare class OrderManagementController {
    /**
     * Finalize an order
     * @route PUT /api/orders/:orderId
     */
    finalizeOrder(req: Request, res: Response): Promise<void>;
    /**
     * Get order details
     * @route GET /api/orders/:orderId
     */
    getOrder(req: Request, res: Response): Promise<void>;
}
declare const _default: OrderManagementController;
export default _default;
